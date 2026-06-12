import mongoose from "mongoose";
// import dotenv from "dotenv";
import { Resource } from "../src/models/Resource.js";
import { Metric } from "../src/models/Metric.js";

// dotenv.config({ path: ".env" });

// MongoDB URI from environment
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define MONGODB_URI in .env file");
  process.exit(1);
}

// Helper functions
function generateResourceId(serviceType, index) {
  if (serviceType === "EC2")
    return `i-${Math.random().toString(16).substr(2, 12).padEnd(12, "0")}`;
  if (serviceType === "S3") return `s3-bucket-${index}`;
  if (serviceType === "RDS")
    return `rds-db-${Math.random().toString(16).substr(2, 12).padEnd(12, "0")}`;
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomMetrics(
  resourceType,
  costPerHour,
  isAnomaly = false,
  anomalyType = null,
) {
  let cpu, memory;

  if (anomalyType === "idle") {
    // Idle resource: very low CPU
    cpu = Math.random() * 4; // 0-4%
    memory = Math.random() * 3; // 0-3%
  } else if (anomalyType === "oversized") {
    // Oversized resource: low utilization
    cpu = Math.random() * 14; // 0-14%
    memory = Math.random() * 19; // 0-19%
  } else {
    // Normal resource
    cpu = Math.random() * 100;
    memory = Math.random() * 100;
  }

  const storageGB =
    resourceType === "S3" ? Math.random() * 500 + 100 : undefined;
  const readOps = resourceType === "S3" ? Math.random() * 1000 : undefined;
  const writeOps = resourceType === "S3" ? Math.random() * 500 : undefined;

  return {
    cpuUtilization: cpu,
    memoryUtilization: memory,
    storageSizeGB: storageGB,
    readOperations: readOps,
    writeOperations: writeOps,
    costIncurred: costPerHour,
  };
}

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("Connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing data...");
    await Resource.deleteMany({});
    await Metric.deleteMany({});
    console.log("✓ Cleared existing data");

    const resources = [];
    const serviceTypes = ["EC2", "S3", "RDS"];
    const environments = ["Production", "Development", "Testing"];
    const departments = ["Engineering", "Marketing", "Data Science"];
    const ec2Instances = [
      "t3.micro",
      "t3.small",
      "t3.medium",
      "t3.large",
      "t3.xlarge",
      "t3.2xlarge",
    ];
    const rdsInstances = [
      "db.t3.micro",
      "db.t3.small",
      "db.r5.large",
      "db.r5.xlarge",
    ];

    // Create normal resources
    console.log("Creating normal resources...");
    for (let i = 0; i < 40; i++) {
      const serviceType = getRandomElement(serviceTypes);
      const environment = getRandomElement(environments);
      const department = getRandomElement(departments);

      let instanceType = "";
      let costPerHour = 0;

      if (serviceType === "EC2") {
        instanceType = getRandomElement(ec2Instances);
        costPerHour = parseFloat((Math.random() * 1 + 0.1).toFixed(3)); // $0.1 to $1.1 per hour
      } else if (serviceType === "S3") {
        costPerHour = parseFloat((Math.random() * 0.5 + 0.01).toFixed(3)); // $0.01 to $0.5 per hour
      } else if (serviceType === "RDS") {
        instanceType = getRandomElement(rdsInstances);
        costPerHour = parseFloat((Math.random() * 1.5 + 0.2).toFixed(3)); // $0.2 to $1.7 per hour
      }

      const resourceId = generateResourceId(serviceType, i);
      const launchTimestamp = new Date(
        Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
      ); // Random date in last 90 days

      resources.push({
        resourceId,
        serviceType,
        region: "us-east-1",
        instanceType: instanceType || undefined,
        launchTimestamp,
        status: "running",
        costPerHour,
        environment,
        department,
      });
    }

    // Create idle resources (5 EC2/RDS instances with very low CPU)
    console.log("Creating idle resources...");
    for (let i = 0; i < 5; i++) {
      const serviceType = getRandomElement(["EC2", "RDS"]);
      const instanceType =
        serviceType === "EC2"
          ? getRandomElement(ec2Instances)
          : getRandomElement(rdsInstances);
      const costPerHour = parseFloat((Math.random() * 0.5 + 0.2).toFixed(3));

      resources.push({
        resourceId: generateResourceId(serviceType, 40 + i),
        serviceType,
        region: "us-east-1",
        instanceType,
        launchTimestamp: new Date(
          Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
        ),
        status: "running",
        costPerHour,
        environment: "Development",
        department: getRandomElement(departments),
      });
    }

    // Create oversized resources (3 EC2 instances with high cost and low utilization)
    console.log("Creating oversized resources...");
    for (let i = 0; i < 3; i++) {
      resources.push({
        resourceId: generateResourceId("EC2", 45 + i),
        serviceType: "EC2",
        region: "us-east-1",
        instanceType: "t3.2xlarge", // Expensive instance type
        launchTimestamp: new Date(
          Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
        ),
        status: "running",
        costPerHour: 1.2, // ~$28.8 per day, ~$864 per month
        environment: "Development",
        department: getRandomElement(departments),
      });
    }

    // Create unused S3 buckets (some will have no read/write operations)
    console.log("Creating unattached storage resources...");
    for (let i = 0; i < 2; i++) {
      resources.push({
        resourceId: generateResourceId("S3", 48 + i),
        serviceType: "S3",
        region: "us-east-1",
        launchTimestamp: new Date(
          Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
        ),
        status: "running",
        costPerHour: 0.1,
        environment: "Testing",
        department: getRandomElement(departments),
      });
    }

    // Insert all resources
    console.log(`Inserting ${resources.length} resources...`);
    const insertedResources = await Resource.insertMany(resources);
    console.log(`✓ Inserted ${insertedResources.length} resources`);

    // Generate metrics for each resource
    console.log("Generating metrics for last 30 days...");
    const metrics = [];
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      const isIdleResource = i >= 40 && i < 45;
      const isOversizedResource = i >= 45 && i < 48;
      const isUnattachedStorage = i >= 48;

      // Generate hourly metrics for the last 30 days
      for (let day = 0; day < 30; day++) {
        for (let hour = 0; hour < 24; hour++) {
          const timestamp = new Date(
            thirtyDaysAgo.getTime() + (day * 24 + hour) * 60 * 60 * 1000,
          );
          const metric = generateRandomMetrics(
            resource.serviceType,
            resource.costPerHour,
            true,
            isIdleResource ? "idle" : isOversizedResource ? "oversized" : null,
          );

          // For unattached storage, set read/write operations to 0
          if (isUnattachedStorage) {
            metric.readOperations = 0;
            metric.writeOperations = 0;
          }

          metrics.push({
            resourceId: resource.resourceId,
            timestamp,
            ...metric,
          });
        }
      }
    }

    console.log(`Inserting ${metrics.length} metrics...`);
    // Insert in batches to avoid memory issues
    const batchSize = 10000;
    for (let i = 0; i < metrics.length; i += batchSize) {
      const batch = metrics.slice(i, i + batchSize);
      await Metric.insertMany(batch, { ordered: false });
    }
    console.log(`✓ Inserted ${metrics.length} metrics`);

    console.log("\n✓ Database seeding completed successfully!");
    console.log("\nSummary:");
    console.log(`- Total Resources: ${resources.length}`);
    console.log(
      `  - EC2 Instances: ${resources.filter((r) => r.serviceType === "EC2").length}`,
    );
    console.log(
      `  - S3 Buckets: ${resources.filter((r) => r.serviceType === "S3").length}`,
    );
    console.log(
      `  - RDS Databases: ${resources.filter((r) => r.serviceType === "RDS").length}`,
    );
    console.log(`- Total Metrics: ${metrics.length}`);
    console.log(`- Anomalies Created:`);
    console.log(`  - Idle Resources: 5`);
    console.log(`  - Oversized Instances: 3`);
    console.log(`  - Unattached Storage: 2`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error.message);
    if (mongoose.connection) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
