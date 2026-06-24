import { connectDB } from "../../../../lib/mongodb";
import { Resource } from "../../../../models/Resource";
import { Metric } from "../../../../models/Metric";
import { verifySession } from "../../../../lib/auth-helper";
import { syncAndFetchAlerts } from "../../../../lib/alerts-helper";

export async function GET(request) {
  try {
    const session = await verifySession(request);

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const url = new URL(request.url);
    const environment = url.searchParams.get("environment");

    let resourceFilter = {};
    if (environment && ["Production", "Development", "Testing"].includes(environment)) {
      resourceFilter.environment = environment;
    }

    // Fetch resources based on environment
    const resources = await Resource.find(resourceFilter).lean();
    const resourceIds = resources.map((r) => r.resourceId);

    // Get budget limit from environment or default
    const budget = parseFloat(process.env.BUDGET_LIMIT || "5000");

    if (resources.length === 0) {
      return Response.json({
        totalSpend: 0,
        budget,
        remainingBudget: budget,
        activeResources: 0,
        totalResources: 0,
        computeSpend: 0,
        storageSpend: 0,
        rdsSpend: 0,
        totalSavings: 0,
        activeAlerts: 0,
      });
    }

    // Get last 30 days of metrics
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ec2Ids = resources.filter((r) => r.serviceType === "EC2").map((r) => r.resourceId);
    const s3Ids = resources.filter((r) => r.serviceType === "S3").map((r) => r.resourceId);
    const rdsIds = resources.filter((r) => r.serviceType === "RDS").map((r) => r.resourceId);

    // Fetch spendStats and alerts in parallel
    const [spendStats, alertsList] = await Promise.all([
      Metric.aggregate([
        {
          $match: {
            timestamp: { $gte: thirtyDaysAgo },
            resourceId: { $in: resourceIds },
          },
        },
        {
          $group: {
            _id: null,
            totalSpend: { $sum: "$costIncurred" },
            computeSpend: {
              $sum: {
                $cond: [{ $in: ["$resourceId", ec2Ids] }, "$costIncurred", 0],
              },
            },
            storageSpend: {
              $sum: {
                $cond: [{ $in: ["$resourceId", s3Ids] }, "$costIncurred", 0],
              },
            },
            rdsSpend: {
              $sum: {
                $cond: [{ $in: ["$resourceId", rdsIds] }, "$costIncurred", 0],
              },
            },
          },
        },
      ]),
      syncAndFetchAlerts(environment)
    ]);

    const activeAlertsList = alertsList.filter((a) => a.status === "unresolved" || a.status === "in progress");
    const activeAlerts = activeAlertsList.length;
    const totalSavings = activeAlertsList.reduce((sum, a) => sum + a.potentialSavings, 0);

    const stats = spendStats[0] || {
      totalSpend: 0,
      computeSpend: 0,
      storageSpend: 0,
      rdsSpend: 0,
    };

    const totalSpend = stats.totalSpend;
    const remainingBudget = Math.max(0, budget - totalSpend);
    const totalResources = resources.length;
    const activeResources = resources.filter((r) => r.status === "running").length;

    return Response.json({
      totalSpend,
      budget,
      remainingBudget,
      activeResources,
      totalResources,
      computeSpend: stats.computeSpend,
      storageSpend: stats.storageSpend,
      rdsSpend: stats.rdsSpend,
      totalSavings,
      activeAlerts,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return Response.json(
      { error: "Failed to fetch dashboard summary" },
      { status: 500 },
    );
  }
}
