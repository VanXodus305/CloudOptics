import { connectDB } from "../../../../lib/mongodb";
import { Metric } from "../../../../models/Metric";
import { Resource } from "../../../../models/Resource";
import { verifySession } from "../../../../lib/auth-helper";

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

    const resources = await Resource.find(resourceFilter).lean();
    const resourceIds = resources.map((r) => r.resourceId);

    if (resources.length === 0) {
      return Response.json([]);
    }

    const ec2Ids = resources.filter((r) => r.serviceType === "EC2").map((r) => r.resourceId);
    const s3Ids = resources.filter((r) => r.serviceType === "S3").map((r) => r.resourceId);

    let matchQuery = {
      resourceId: { $in: resourceIds }
    };

    // Get last 30 days of data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    matchQuery.timestamp = { $gte: thirtyDaysAgo };

    const trends = await Metric.aggregate([
      {
        $match: matchQuery,
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$timestamp",
            },
          },
          spend: { $sum: "$costIncurred" },
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
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          spend: 1,
          computeSpend: 1,
          storageSpend: 1,
          _id: 0,
        },
      },
    ]);

    return Response.json(trends);
  } catch (error) {
    console.error("Error fetching trends:", error);
    return Response.json({ error: "Failed to fetch trends" }, { status: 500 });
  }
}
