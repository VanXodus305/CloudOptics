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

    const serviceBreakdown = await Metric.aggregate([
      {
        $match: matchQuery,
      },
      {
        $lookup: {
          from: "resources",
          localField: "resourceId",
          foreignField: "resourceId",
          as: "resource",
        },
      },
      {
        $unwind: "$resource",
      },
      {
        $group: {
          _id: "$resource.serviceType",
          value: { $sum: "$costIncurred" },
        },
      },
      {
        $project: {
          service: "$_id",
          value: 1,
          _id: 0,
        },
      },
    ]);

    return Response.json(serviceBreakdown);
  } catch (error) {
    console.error("Error fetching service breakdown:", error);
    return Response.json(
      { error: "Failed to fetch service breakdown" },
      { status: 500 },
    );
  }
}
