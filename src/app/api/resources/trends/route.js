import { connectDB } from "../../../../lib/mongodb";
import { Metric } from "../../../../models/Metric";
import { verifySession } from "../../../../lib/auth-helper";

export async function GET(request) {
  try {
    const session = await verifySession(request);

    if (!session || !session.user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const url = new URL(request.url);
    const resourceId = url.searchParams.get("resourceId");

    if (!resourceId) {
      return Response.json({ error: "resourceId is required" }, { status: 400 });
    }

    // Find the latest timestamp in the DB for this resource
    const latestMetric = await Metric.findOne({ resourceId })
      .sort({ timestamp: -1 })
      .select("timestamp")
      .lean();

    const latestTimestamp = latestMetric ? new Date(latestMetric.timestamp) : new Date();

    const twentyFourHoursBeforeLatest = new Date(latestTimestamp);
    twentyFourHoursBeforeLatest.setHours(twentyFourHoursBeforeLatest.getHours() - 24);

    const thirtyDaysBeforeLatest = new Date(latestTimestamp);
    thirtyDaysBeforeLatest.setDate(thirtyDaysBeforeLatest.getDate() - 30);

    // Run both hourly (24h) and daily (30d) aggregations for the specific resource
    const [hourly, daily] = await Promise.all([
      Metric.aggregate([
        {
          $match: {
            resourceId,
            timestamp: { $gte: twentyFourHoursBeforeLatest, $lte: latestTimestamp },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$timestamp" },
              month: { $month: "$timestamp" },
              day: { $dayOfMonth: "$timestamp" },
              hour: { $hour: "$timestamp" },
            },
            cpu: { $avg: "$cpuUtilization" },
            memory: { $avg: "$memoryUtilization" },
            storage: { $avg: "$storageSizeGB" },
            readOps: { $avg: "$readOperations" },
            writeOps: { $avg: "$writeOperations" },
          },
        },
        {
          $project: {
            _id: 0,
            resourceId: { $literal: resourceId },
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
            hour: "$_id.hour",
            cpu: 1,
            memory: 1,
            storage: 1,
            readOps: 1,
            writeOps: 1,
          },
        },
      ]),
      Metric.aggregate([
        {
          $match: {
            resourceId,
            timestamp: { $gte: thirtyDaysBeforeLatest, $lte: latestTimestamp },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$timestamp" },
              month: { $month: "$timestamp" },
              day: { $dayOfMonth: "$timestamp" },
            },
            cpu: { $avg: "$cpuUtilization" },
            memory: { $avg: "$memoryUtilization" },
            storage: { $avg: "$storageSizeGB" },
            readOps: { $avg: "$readOperations" },
            writeOps: { $avg: "$writeOperations" },
          },
        },
        {
          $project: {
            _id: 0,
            resourceId: { $literal: resourceId },
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
            cpu: 1,
            memory: 1,
            storage: 1,
            readOps: 1,
            writeOps: 1,
          },
        },
      ]),
    ]);

    return Response.json({ hourly, daily });
  } catch (error) {
    console.error("Error fetching resource trends:", error);
    return Response.json(
      { error: "Failed to fetch resource trends" },
      { status: 500 },
    );
  }
}
