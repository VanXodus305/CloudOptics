import { auth } from "../../../../app/api/auth/[...nextauth]/route";
import { connectDB } from "../../../../lib/mongodb";
import { Metric } from "../../../../models/Metric";
import { Resource } from "../../../../models/Resource";

export async function GET(request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    // Get last 30 days of data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get service breakdown
    const serviceBreakdown = await Metric.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo },
        },
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
