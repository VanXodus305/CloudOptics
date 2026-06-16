import { connectDB } from "../../../lib/mongodb";
import { Resource } from "../../../models/Resource";
import { verifySession } from "../../../lib/auth-helper";

export async function GET(request) {
  try {
    const session = await verifySession(request);

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const url = new URL(request.url);
    const environment = url.searchParams.get("environment");
    const search = url.searchParams.get("search");
    const service = url.searchParams.get("service");

    let query = {};
    if (environment && ["Production", "Development", "Testing"].includes(environment)) {
      query.environment = environment;
    }
    if (service && ["EC2", "S3", "RDS"].includes(service)) {
      query.serviceType = service;
    }
    if (search) {
      query.resourceId = { $regex: search, $options: "i" };
    }

    const resources = await Resource.find(query).lean();

    const formattedResources = resources.map((r) => {
      const projectedMonthlyCost = r.costPerHour * 24 * 30;
      return {
        id: r._id.toString(),
        name: r.resourceId,
        service: r.serviceType,
        cost: projectedMonthlyCost,
        status: r.status ? r.status.charAt(0).toUpperCase() + r.status.slice(1) : "Running",
        region: r.region || "us-east-1",
        environment: r.environment,
      };
    });

    return Response.json(formattedResources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return Response.json(
      { error: "Failed to fetch resources" },
      { status: 500 },
    );
  }
}
