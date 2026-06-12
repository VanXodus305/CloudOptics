import { auth } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/mongodb";
import { Metric } from "@/models/Metric";
import { Resource } from "@/models/Resource";

export async function GET(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const alerts = [];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Get all resources
    const resources = await Resource.find({ status: "running" }).lean();

    for (const resource of resources) {
      // Get metrics for this resource
      const metrics = await Metric.find({
        resourceId: resource.resourceId,
        timestamp: { $gte: sevenDaysAgo },
      }).lean();

      if (metrics.length === 0) continue;

      // Calculate averages
      const validCpuMetrics = metrics.filter((m) => m.cpuUtilization != null);
      const avgCpu =
        validCpuMetrics.length > 0
          ? validCpuMetrics.reduce((sum, m) => sum + m.cpuUtilization, 0) /
            validCpuMetrics.length
          : 0;

      const validMemoryMetrics = metrics.filter(
        (m) => m.memoryUtilization != null,
      );
      const avgMemory =
        validMemoryMetrics.length > 0
          ? validMemoryMetrics.reduce(
              (sum, m) => sum + m.memoryUtilization,
              0,
            ) / validMemoryMetrics.length
          : 0;

      const maxCpu = Math.max(
        ...validCpuMetrics.map((m) => m.cpuUtilization),
        0,
      );
      const maxMemory = Math.max(
        ...validMemoryMetrics.map((m) => m.memoryUtilization),
        0,
      );

      const totalCost = metrics.reduce((sum, m) => sum + m.costIncurred, 0);
      const monthlyCost = totalCost * (30 / 7); // Extrapolate 7-day to 30-day cost

      // Rule 1: Idle Resource Alert (CPU < 5% for 7 days)
      if (
        avgCpu < 5 &&
        (resource.serviceType === "EC2" || resource.serviceType === "RDS")
      ) {
        alerts.push({
          resourceId: resource.resourceId,
          type: "Idle",
          severity: "High",
          message: `Resource is idle with average CPU utilization of ${avgCpu.toFixed(2)}%`,
          potentialSavings: monthlyCost * 0.8, // Assume 80% savings by removing idle resource
          currentCost: monthlyCost,
        });
      }

      // Rule 2: Oversized Instance Alert (>$100/month, CPU < 15%, Memory < 20%)
      if (
        monthlyCost > 100 &&
        maxCpu < 15 &&
        maxMemory < 20 &&
        (resource.serviceType === "EC2" || resource.serviceType === "RDS")
      ) {
        alerts.push({
          resourceId: resource.resourceId,
          type: "Oversized",
          severity: "Medium",
          message: `Instance is oversized. Cost: $${monthlyCost.toFixed(2)}/month with max CPU ${maxCpu.toFixed(2)}% and max memory ${maxMemory.toFixed(2)}%`,
          potentialSavings: monthlyCost * 0.4, // Assume 40% savings by downsizing
          currentCost: monthlyCost,
        });
      }

      // Rule 3: Unattached Storage Alert (S3 with 0 read/write operations for 7 days)
      if (resource.serviceType === "S3") {
        const withOperations = metrics.filter(
          (m) => (m.readOperations || 0) > 0 || (m.writeOperations || 0) > 0,
        );

        if (withOperations.length === 0) {
          alerts.push({
            resourceId: resource.resourceId,
            type: "UnattachedStorage",
            severity: "Medium",
            message: `Storage bucket has zero read/write operations over the past 7 days`,
            potentialSavings: monthlyCost * 0.95, // Assume 95% savings by removing unused storage
            currentCost: monthlyCost,
          });
        }
      }
    }

    return Response.json(alerts);
  } catch (error) {
    console.error("Error fetching optimization alerts:", error);
    return Response.json(
      { error: "Failed to fetch optimization alerts" },
      { status: 500 },
    );
  }
}
