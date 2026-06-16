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

  // Generate realistic metrics based on resource type and anomaly type
  if (resource.serviceType === "EC2") {
    cpuUtilization = faker.number.int({ min: 10, max: 80 });
    memoryUtilization = faker.number.int({ min: 15, max: 75 });
    readOps = faker.number.int({ min: 100, max: 5000 });
    writeOps = faker.number.int({ min: 50, max: 3000 });
    storageSizeGB = 0;

    if (anomalyType === "idle") {
      cpuUtilization = faker.number.int({ min: 1, max: 4 });
      memoryUtilization = faker.number.int({ min: 5, max: 20 });
    } else if (anomalyType === "oversized") {
      cpuUtilization = faker.number.int({ min: 4, max: 12 });
      memoryUtilization = faker.number.int({ min: 5, max: 17 });
    }
  } else if (resource.serviceType === "RDS") {
    cpuUtilization = faker.number.int({ min: 15, max: 70 });
    memoryUtilization = faker.number.int({ min: 20, max: 70 });
    readOps = faker.number.int({ min: 500, max: 10000 });
    writeOps = faker.number.int({ min: 200, max: 5000 });
    storageSizeGB = faker.number.int({ min: 10, max: 500 });

    if (anomalyType === "idle") {
      cpuUtilization = faker.number.int({ min: 1, max: 4 });
      memoryUtilization = faker.number.int({ min: 10, max: 30 });
    } else if (anomalyType === "oversized") {
      cpuUtilization = faker.number.int({ min: 4, max: 12 });
      memoryUtilization = faker.number.int({ min: 10, max: 18 });
    }
  } else if (resource.serviceType === "S3") {
    cpuUtilization = 0;
    memoryUtilization = 0;
    readOps = faker.number.int({ min: 100, max: 50000 });
    writeOps = faker.number.int({ min: 50, max: 10000 });
    storageSizeGB = faker.number.int({ min: 100, max: 5000 });

    if (anomalyType === "unattached") {
      readOps = 0;
      writeOps = 0;
    }
  }

  return {
    resourceId: resource.resourceId,
    timestamp: new Date(),
    cpuUtilization,
    memoryUtilization,
    storageSizeGB,
    readOperations: readOps,
    writeOperations: writeOps,
    costIncurred: resource.costPerHour,
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
