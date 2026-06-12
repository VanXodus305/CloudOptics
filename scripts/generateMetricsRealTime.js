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

  // Generate realistic metrics based on resource type
  if (resource.serviceType === "EC2") {
    // Simulate varying CPU and memory usage
    cpuUtilization = faker.number.int({ min: 5, max: 85 });
    memoryUtilization = faker.number.int({ min: 10, max: 80 });
    readOps = faker.number.int({ min: 100, max: 5000 });
    writeOps = faker.number.int({ min: 50, max: 3000 });
    storageSizeGB = 0; // EC2 doesn't typically have storage metrics
  } else if (resource.serviceType === "RDS") {
    // Database patterns
    cpuUtilization = faker.number.int({ min: 10, max: 70 });
    memoryUtilization = faker.number.int({ min: 20, max: 75 });
    readOps = faker.number.int({ min: 500, max: 10000 });
    writeOps = faker.number.int({ min: 200, max: 5000 });
    storageSizeGB = faker.number.int({ min: 10, max: 500 });
  } else if (resource.serviceType === "S3") {
    // Storage patterns
    cpuUtilization = 0; // S3 is serverless
    memoryUtilization = 0;
    readOps = faker.number.int({ min: 0, max: 50000 });
    writeOps = faker.number.int({ min: 0, max: 10000 });
    storageSizeGB = faker.number.int({ min: 100, max: 5000 });
  }

  return {
    resourceId: resource.resourceId,
    timestamp: new Date(),
    cpuUtilization,
    memoryUtilization,
    storageSizeGB,
    readOperations: readOps,
    writeOperations: writeOps,
    costIncurred: resource.costPerHour, // Simplified: hourly cost = metric cost
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
