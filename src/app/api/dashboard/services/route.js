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

    let resourceQuery = {};
    if (environment && ["Production", "Development", "Testing"].includes(environment)) {
      resourceQuery.environment = environment;
    }

    const resources = await Resource.find(resourceQuery).lean();
    const resourceIds = resources.map((r) => r.resourceId);

    if (resourceIds.length === 0) {
      return Response.json([]);
    }

    const resourceMap = {};
    resources.forEach((r) => {
      resourceMap[r.resourceId] = r.serviceType;
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const spendByResource = await Metric.aggregate([
      {
        $match: {
          resourceId: { $in: resourceIds },
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: "$resourceId",
          value: { $sum: "$costIncurred" },
        },
      },
    ]);

    const serviceMap = {
      EC2: 0,
      S3: 0,
      RDS: 0,
    };

    spendByResource.forEach((item) => {
      const serviceType = resourceMap[item._id];
      if (serviceType) {
        serviceMap[serviceType] += item.value;
      }
    });

    const serviceBreakdown = Object.entries(serviceMap).map(([service, value]) => ({
      service,
      value,
    }));

    return Response.json(serviceBreakdown);
  } catch (error) {
    console.error("Error fetching service breakdown:", error);
    return Response.json(
      { error: "Failed to fetch service breakdown" },
      { status: 500 },
    );
  }
}
