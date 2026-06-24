import { Metric } from "../models/Metric.js";
import { Resource } from "../models/Resource.js";
import { Alert } from "../models/Alert.js";

export async function calculateAlerts(environmentFilter = null, preloadedResources = null) {
  const alerts = [];
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  let resources;
  if (preloadedResources) {
    resources = preloadedResources.filter((r) => r.status === "running");
  } else {
    const resourceQuery = { status: "running" };
    if (environmentFilter && ["Production", "Development", "Testing"].includes(environmentFilter)) {
      resourceQuery.environment = environmentFilter;
    }
    resources = await Resource.find(resourceQuery).lean();
  }
  const resourceIds = resources.map((r) => r.resourceId);

  if (resourceIds.length === 0) return [];

  // Run a single aggregation query on the database
  const metricStats = await Metric.aggregate([
    {
      $match: {
        resourceId: { $in: resourceIds },
        timestamp: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: "$resourceId",
        avgCpu: { $avg: "$cpuUtilization" },
        maxCpu: { $max: "$cpuUtilization" },
        avgMemory: { $avg: "$memoryUtilization" },
        maxMemory: { $max: "$memoryUtilization" },
        totalCost: { $sum: "$costIncurred" },
        totalReadOps: { $sum: "$readOperations" },
        totalWriteOps: { $sum: "$writeOperations" },
        count: { $sum: 1 },
      },
    },
  ]);

  // Index the aggregated results by resourceId for fast lookup
  const statsMap = {};
  for (const stat of metricStats) {
    statsMap[stat._id] = stat;
  }

  for (const resource of resources) {
    const stat = statsMap[resource.resourceId];
    if (!stat || stat.count === 0) continue;

    const avgCpu = stat.avgCpu || 0;
    const avgMemory = stat.avgMemory || 0;
    const maxCpu = stat.maxCpu || 0;
    const maxMemory = stat.maxMemory || 0;
    const totalCost = stat.totalCost || 0;
    const monthlyCost = totalCost * (30 / 7); // Extrapolate 7-day to 30-day cost

    // Rule 1: Idle Resource Alert (CPU < 5% for 7 days)
    if (
      avgCpu < 5 &&
      (resource.serviceType === "EC2" || resource.serviceType === "RDS")
    ) {
      alerts.push({
        resourceId: resource.resourceId,
        type: "Idle",
        severity: "High",
        message: `Resource is idle with average CPU utilization of ${avgCpu.toFixed(2)}%`,
        potentialSavings: monthlyCost * 0.8,
        currentCost: monthlyCost,
        environment: resource.environment,
      });
    }

    // Rule 2: Oversized Instance Alert (>$100/month, CPU < 15%, Memory < 20%)
    if (
      monthlyCost > 100 &&
      maxCpu < 15 &&
      maxMemory < 20 &&
      (resource.serviceType === "EC2" || resource.serviceType === "RDS")
    ) {
      alerts.push({
        resourceId: resource.resourceId,
        type: "Oversized",
        severity: "Medium",
        message: `Instance is oversized. Cost: $${monthlyCost.toFixed(2)}/month with max CPU ${maxCpu.toFixed(2)}% and max memory ${maxMemory.toFixed(2)}%`,
        potentialSavings: monthlyCost * 0.4,
        currentCost: monthlyCost,
        environment: resource.environment,
      });
    }

    // Rule 3: Unattached Storage Alert (S3 with 0 read/write operations for 7 days)
    if (resource.serviceType === "S3") {
      const totalOps = (stat.totalReadOps || 0) + (stat.totalWriteOps || 0);
      if (totalOps === 0) {
        alerts.push({
          resourceId: resource.resourceId,
          type: "UnattachedStorage",
          severity: "Medium",
          message: `Storage bucket has zero read/write operations over the past 7 days`,
          potentialSavings: monthlyCost * 0.95,
          currentCost: monthlyCost,
          environment: resource.environment,
        });
      }
    }
  }

  return alerts;
}

export async function syncAndFetchAlerts(environmentFilter = null) {
  // 1. Calculate active alerts on-the-fly globally
  const activeAlerts = await calculateAlerts();
  
  // 2. Query all existing alerts from database
  const existingAlerts = await Alert.find({}).lean();
  const existingMap = {};
  existingAlerts.forEach((a) => {
    existingMap[`${a.resourceId}_${a.type}`] = a;
  });

  const activeKeys = new Set();

  // 3. Sync active alerts to database
  for (const alertData of activeAlerts) {
    const key = `${alertData.resourceId}_${alertData.type}`;
    activeKeys.add(key);

    const existing = existingMap[key];
    if (!existing) {
      // Create new unresolved alert
      await Alert.create({
        resourceId: alertData.resourceId,
        type: alertData.type,
        severity: alertData.severity,
        message: alertData.message,
        potentialSavings: alertData.potentialSavings,
        currentCost: alertData.currentCost,
        environment: alertData.environment,
        status: "unresolved"
      });
    } else {
      // Update stats on existing alert, preserve status
      await Alert.findByIdAndUpdate(existing._id, {
        potentialSavings: alertData.potentialSavings,
        currentCost: alertData.currentCost,
        message: alertData.message,
        severity: alertData.severity
      });
    }
  }

  // 4. Auto-resolve alerts not detected in the current aggregate run
  for (const existing of existingAlerts) {
    const key = `${existing.resourceId}_${existing.type}`;
    if (!activeKeys.has(key)) {
      if (existing.status !== "resolved") {
        await Alert.findByIdAndUpdate(existing._id, { status: "resolved" });
      }
    }
  }

  // 5. Query and return matching alerts
  const query = {};
  if (environmentFilter && ["Production", "Development", "Testing"].includes(environmentFilter)) {
    query.environment = environmentFilter;
  }
  return await Alert.find(query).sort({ updatedAt: -1 }).lean();
}
