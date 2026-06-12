import { auth } from "../../../../app/api/auth/[...nextauth]/route";
import { connectDB } from "../../../../lib/mongodb";
import { Metric } from "../../../../models/Metric";

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

    const trends = await Metric.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo },
        },
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
