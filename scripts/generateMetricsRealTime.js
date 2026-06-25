import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import { Resource } from "../src/models/Resource.js";
import { Metric } from "../src/models/Metric.js";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let isRunning = true;

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n✓ Shutting down data generator...");
  isRunning = false;
  await mongoose.connection.close();
  process.exit(0);
});

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");
  } catch (error) {
    console.error("✗ MongoDB connection error:", error.message);
    process.exit(1);
  }
}

function generateRealisticMetrics(resource) {
  let cpuUtilization, memoryUtilization, storageSizeGB, readOps, writeOps;
  const anomalyType = resource.anomalyType || "none";

  const timestamp = new Date();
  const hour = timestamp.getHours();
  const dayOfWeek = timestamp.getDay();
  const dayOfMonth = timestamp.getDate();

  // 1. Diurnal curve peaking at 2 PM: ranges from 0.45 to 1.55
  const diurnalFactor = 1.0 + 0.55 * Math.sin(((hour - 8) / 24) * 2 * Math.PI);

  // 2. Weekend multiplier: 0.35 + random on weekends vs 0.85 + random on weekdays
  const weekendFactor = (dayOfWeek === 0 || dayOfWeek === 6)
    ? 0.35 + Math.random() * 0.15
    : 0.85 + Math.random() * 0.3;

  // 3. Daily multiplier: organic fluctuation based on day of month, ranges from 0.8 to 1.2
  const dailyMult = 1.0 + 0.2 * Math.sin((dayOfMonth / 30) * 2 * Math.PI);

  // Generate realistic metrics based on resource type and anomaly type
  if (resource.serviceType === "EC2") {
    let cpu = faker.number.int({ min: 15, max: 65 });
    let mem = faker.number.int({ min: 20, max: 70 });

    if (anomalyType === "idle") {
      cpu = faker.number.int({ min: 1, max: 4 });
      mem = faker.number.int({ min: 5, max: 20 });
    } else if (anomalyType === "oversized") {
      cpu = faker.number.int({ min: 4, max: 12 });
      mem = faker.number.int({ min: 5, max: 17 });
    } else {
      cpu = Math.max(1, Math.min(100, Math.round(cpu * diurnalFactor)));
      mem = Math.max(1, Math.min(100, Math.round(mem * (diurnalFactor * 0.4 + 0.6))));
    }

    cpuUtilization = cpu;
    memoryUtilization = mem;
    readOps = Math.round(faker.number.int({ min: 100, max: 5000 }) * diurnalFactor);
    writeOps = Math.round(faker.number.int({ min: 50, max: 3000 }) * diurnalFactor);
    storageSizeGB = 0;
  } else if (resource.serviceType === "RDS") {
    let cpu = faker.number.int({ min: 20, max: 60 });
    let mem = faker.number.int({ min: 25, max: 65 });

    if (anomalyType === "idle") {
      cpu = faker.number.int({ min: 1, max: 4 });
      mem = faker.number.int({ min: 10, max: 30 });
    } else if (anomalyType === "oversized") {
      cpu = faker.number.int({ min: 4, max: 12 });
      mem = faker.number.int({ min: 10, max: 18 });
    } else {
      cpu = Math.max(1, Math.min(100, Math.round(cpu * diurnalFactor)));
      mem = Math.max(1, Math.min(100, Math.round(mem * (diurnalFactor * 0.4 + 0.6))));
    }

    cpuUtilization = cpu;
    memoryUtilization = mem;
    readOps = Math.round(faker.number.int({ min: 500, max: 10000 }) * diurnalFactor);
    writeOps = Math.round(faker.number.int({ min: 200, max: 5000 }) * diurnalFactor);
    storageSizeGB = faker.number.int({ min: 10, max: 500 });
  } else if (resource.serviceType === "S3") {
    let s3ReadOps = faker.number.int({ min: 100, max: 50000 });
    let s3WriteOps = faker.number.int({ min: 50, max: 10000 });
    storageSizeGB = faker.number.int({ min: 100, max: 5000 });

    if (anomalyType === "unattached") {
      readOps = 0;
      writeOps = 0;
    } else {
      readOps = Math.round(s3ReadOps * diurnalFactor);
      writeOps = Math.round(s3WriteOps * diurnalFactor);
    }
    cpuUtilization = 0;
    memoryUtilization = 0;
  }

  const hourlyNoise = 0.8 + Math.random() * 0.4; // 0.8 to 1.2
  const costIncurred = Math.round(resource.costPerHour * dailyMult * weekendFactor * diurnalFactor * hourlyNoise * 1000) / 1000;

  return {
    resourceId: resource.resourceId,
    timestamp: new Date(),
    cpuUtilization,
    memoryUtilization,
    storageSizeGB,
    readOperations: readOps,
    writeOperations: writeOps,
    costIncurred,
  };
}

async function generateMetricsForAllResources() {
  try {
    // Fetch all resources
    const resources = await Resource.find();

    if (resources.length === 0) {
      console.log("⚠ No resources found. Run `npm run seed` first.");
      return;
    }

    // Generate metrics for each resource
    const metricsToInsert = resources.map((resource) =>
      generateRealisticMetrics(resource),
    );

    // Insert all metrics at once
    await Metric.insertMany(metricsToInsert);

    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ✓ Generated ${metricsToInsert.length} metrics`);
  } catch (error) {
    console.error("Error generating metrics:", error.message);
  }
}

async function startContinuousGeneration() {
  await connectDB();

  console.log("📊 AWS Resource Metrics Generator Started");
  console.log("⏰ Generating metrics every 10 seconds (simulates hourly data)");
  console.log("💾 Press Ctrl+C to stop\n");

  // Generate initial metrics
  await generateMetricsForAllResources();

  // Generate metrics every 10 seconds (you can adjust this)
  // In production, this would be longer intervals (e.g., every hour)
  const interval = setInterval(async () => {
    if (isRunning) {
      await generateMetricsForAllResources();
    }
  }, 10000); // 10 seconds = fast simulation, change to 3600000 (1 hour) for production

  return interval;
}

startContinuousGeneration().catch(console.error);
