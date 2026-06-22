import { connectDB } from "../../../../lib/mongodb";
import { Resource } from "../../../../models/Resource";
import { Metric } from "../../../../models/Metric";
import { verifySession } from "../../../../lib/auth-helper";

export async function GET(request) {
  try {
    const session = await verifySession(request);

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const url = new URL(request.url);
    const environment = url.searchParams.get("environment") || "All";

    // 1. Get resources for this environment
    const query = environment === "All" ? {} : { environment };
    const resources = await Resource.find(query).lean();
    const resourceIds = resources.map((r) => r.resourceId);

    if (resources.length === 0) {
      return Response.json({
        resources: [],
        costTrends: [],
        serviceCounts: [],
      });
    }

    const ec2Ids = resources.filter((r) => r.serviceType === "EC2").map((r) => r.resourceId);
    const s3Ids = resources.filter((r) => r.serviceType === "S3").map((r) => r.resourceId);
    const rdsIds = resources.filter((r) => r.serviceType === "RDS").map((r) => r.resourceId);

    // 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 2. Fetch metric aggregates for utilization and resources
    const [utilizationStats, costTrends] = await Promise.all([
      Metric.aggregate([
        {
          $match: {
            resourceId: { $in: resourceIds },
            timestamp: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: "$resourceId",
            avgCpu: { $avg: "$cpuUtilization" },
            avgMemory: { $avg: "$memoryUtilization" },
            avgStorage: { $avg: "$storageSizeGB" },
            avgReadOps: { $avg: "$readOperations" },
            avgWriteOps: { $avg: "$writeOperations" },
            totalCost: { $sum: "$costIncurred" },
          },
        },
      ]),
      Metric.aggregate([
        {
          $match: {
            resourceId: { $in: resourceIds },
            timestamp: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$timestamp" },
              month: { $month: "$timestamp" },
              day: { $dayOfMonth: "$timestamp" },
              hour: { $hour: "$timestamp" },
              service: {
                $cond: [
                  { $in: ["$resourceId", ec2Ids] }, "EC2",
                  { $cond: [{ $in: ["$resourceId", s3Ids] }, "S3", "RDS"] }
                ]
              }
            },
            cost: { $sum: "$costIncurred" },
            readOps: { $sum: "$readOperations" },
            writeOps: { $sum: "$writeOperations" },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
            hour: "$_id.hour",
            service: "$_id.service",
            cost: 1,
            readOps: 1,
            writeOps: 1,
          },
        },
      ]),
    ]);

    // Format utilization details map
    const utilizationMap = {};
    utilizationStats.forEach((stat) => {
      utilizationMap[stat._id] = stat;
    });

    // 3. Format resources data
    const formattedResources = resources.map((r) => {
      const stats = utilizationMap[r.resourceId] || {
        avgCpu: 0,
        avgMemory: 0,
        avgStorage: 0,
        avgReadOps: 0,
        avgWriteOps: 0,
        totalCost: 0,
      };

      return {
        id: r._id.toString(),
        resourceId: r.resourceId,
        service: r.serviceType,
        region: r.region || "us-east-1",
        status: r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : "Running",
        costPerHour: r.costPerHour,
        projectedMonthlyCost: r.costPerHour * 24 * 30,
        department: r.department,
        environment: r.environment,
        cpu: Math.round(stats.avgCpu || 0),
        memory: Math.round(stats.avgMemory || 0),
        storage: r.serviceType === "S3" ? Math.min(100, Math.round((stats.avgStorage || 0) / 50)) : Math.round(stats.avgStorage || 0),
        network: Math.min(100, Math.round(((stats.avgReadOps || 0) + (stats.avgWriteOps || 0)) / 400)),
        totalCost: stats.totalCost || 0,
      };
    });

    // 4. Calculate service counts
    const countsMap = { EC2: 0, S3: 0, RDS: 0 };
    resources.forEach((r) => {
      countsMap[r.serviceType] = (countsMap[r.serviceType] || 0) + 1;
    });
    const serviceCounts = Object.entries(countsMap).map(([name, count]) => ({
      name,
      count,
    }));

    return Response.json({
      resources: formattedResources,
      costTrends,
      serviceCounts,
    });
  } catch (error) {
    console.error("Error fetching resources dashboard:", error);
    return Response.json(
      { error: "Failed to fetch resources dashboard" },
      { status: 500 },
    );
  }
}
