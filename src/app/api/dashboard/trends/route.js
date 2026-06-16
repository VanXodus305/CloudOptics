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

    let matchQuery = {};

    // If environment filter is provided, get matching resource IDs first
    if (environment && ["Production", "Development", "Testing"].includes(environment)) {
      const resources = await Resource.find({ environment }).lean();
      const resourceIds = resources.map((r) => r.resourceId);
      matchQuery.resourceId = { $in: resourceIds };
    }

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
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          spend: 1,
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
