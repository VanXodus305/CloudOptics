import { connectDB } from "../../../../lib/mongodb";
import { verifySession } from "../../../../lib/auth-helper";
import { calculateAlerts } from "../../../../lib/alerts-helper";

export async function GET(request) {
  try {
    const session = await verifySession(request);

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const url = new URL(request.url);
    const environment = url.searchParams.get("environment");

    const alerts = await calculateAlerts(environment);

    return Response.json(alerts);
  } catch (error) {
    console.error("Error fetching optimization alerts:", error);
    return Response.json(
      { error: "Failed to fetch optimization alerts" },
      { status: 500 },
    );
  }
}
