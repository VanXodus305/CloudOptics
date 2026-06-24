import { connectDB } from "../../../../lib/mongodb";
import { verifySession } from "../../../../lib/auth-helper";
import { syncAndFetchAlerts } from "../../../../lib/alerts-helper";
import { Alert } from "../../../../models/Alert";

export async function GET(request) {
  try {
    const session = await verifySession(request);

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const url = new URL(request.url);
    const environment = url.searchParams.get("environment");

    const alerts = await syncAndFetchAlerts(environment);

    return Response.json(alerts);
  } catch (error) {
    console.error("Error fetching optimization alerts:", error);
    return Response.json(
      { error: "Failed to fetch optimization alerts" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const session = await verifySession(request);

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { alertId, status } = await request.json();

    if (!alertId || !status) {
      return Response.json({ error: "alertId and status are required" }, { status: 400 });
    }

    if (!["unresolved", "in progress", "resolved"].includes(status)) {
      return Response.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updatedAlert = await Alert.findByIdAndUpdate(
      alertId,
      { status },
      { new: true }
    );

    if (!updatedAlert) {
      return Response.json({ error: "Alert not found" }, { status: 404 });
    }

    return Response.json(updatedAlert);
  } catch (error) {
    console.error("Error updating optimization alert:", error);
    return Response.json(
      { error: "Failed to update alert" },
      { status: 500 }
    );
  }
}
