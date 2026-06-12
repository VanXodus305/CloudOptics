import { auth } from "../../../../app/api/auth/[...nextauth]/route";
import { connectDB } from "../../../../lib/mongodb";
import { Resource } from "../../../../models/Resource";
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

    // Calculate total spend
    const totalSpend = await Metric.aggregate([
      {
        $match: {
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$costIncurred" },
        },
      },
    ]);

    // Count active resources
    const activeResources = await Resource.countDocuments({
      status: "running",
    });

    // Count total resources
    const totalResources = await Resource.countDocuments();

    // Get budget (hardcoded for now, can be made configurable)
    const budget = 5000;
    const remainingBudget = budget - (totalSpend[0]?.total || 0);

    return Response.json({
      totalSpend: totalSpend[0]?.total || 0,
      budget,
      remainingBudget,
      activeResources,
      totalResources,
      activeAlerts: 0, // Will be calculated from optimization rules
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return Response.json(
      { error: "Failed to fetch dashboard summary" },
      { status: 500 },
    );
  }
}
