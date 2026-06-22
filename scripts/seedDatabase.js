import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Resource } from "../src/models/Resource.js";
import { Metric } from "../src/models/Metric.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define MONGODB_URI in .env file");
  process.exit(1);
}

// AWS Instance types
const EC2_INSTANCES = [
  "t3.micro",
  "t3.small",
  "t3.medium",
  "t3.large",
  "t3.xlarge",
  "t3.2xlarge",
  "m5.large",
  "m5.xlarge",
  "c5.large",
  "c5.xlarge",
];

const RDS_INSTANCES = [
  "db.t3.micro",
  "db.t3.small",
  "db.t3.medium",
  "db.r5.large",
  "db.r5.xlarge",
  "db.m5.large",
];

const AWS_REGIONS = [
  "us-east-1",
  "us-west-2",
  "eu-west-1",
  "ap-southeast-1",
  "ap-northeast-1",
];

const ENVIRONMENTS = ["Production", "Development", "Testing"];
const DEPARTMENTS = [
  "Engineering",
  "Marketing",
  "Data Science",
];

function generateEC2ResourceId() {
  return `i-${faker.string.hexadecimal({ length: 17 }).substring(2)}`;
}

function generateRDSResourceId() {
  return `rds-${faker.database.collation().replace(/[_]/g, "-").toLowerCase()}-${faker.string.alphanumeric({ length: 8 }).toLowerCase()}`;
}

function generateS3BucketName() {
  return `${faker.word.adjective()}-${faker.word.noun()}-${faker.number.int(
    {
      min: 1000,
      max: 9999,
    },
  )}`.toLowerCase();
}

function generateResourceMetrics(resource) {
  const serviceType = resource.serviceType;
  const anomalyType = resource.anomalyType || "none";

  if (serviceType === "EC2") {
    let cpu = faker.number.int({ min: 10, max: 80 });
    let mem = faker.number.int({ min: 15, max: 75 });
    
    if (anomalyType === "idle") {
      cpu = faker.number.int({ min: 1, max: 4 });
      mem = faker.number.int({ min: 5, max: 20 });
    } else if (anomalyType === "oversized") {
      cpu = faker.number.int({ min: 4, max: 12 });
      mem = faker.number.int({ min: 5, max: 17 });
    }

    return {
      cpuUtilization: cpu,
      memoryUtilization: mem,
      storageSizeGB: 0,
      readOperations: faker.number.int({ min: 100, max: 5000 }),
      writeOperations: faker.number.int({ min: 50, max: 3000 }),
    };
  } else if (serviceType === "RDS") {
    let cpu = faker.number.int({ min: 15, max: 70 });
    let mem = faker.number.int({ min: 20, max: 70 });

    if (anomalyType === "idle") {
      cpu = faker.number.int({ min: 1, max: 4 });
      mem = faker.number.int({ min: 10, max: 30 });
    } else if (anomalyType === "oversized") {
      cpu = faker.number.int({ min: 4, max: 12 });
      mem = faker.number.int({ min: 10, max: 18 });
    }

    return {
      cpuUtilization: cpu,
      memoryUtilization: mem,
      storageSizeGB: faker.number.int({ min: 10, max: 500 }),
      readOperations: faker.number.int({ min: 500, max: 10000 }),
      writeOperations: faker.number.int({ min: 200, max: 5000 }),
    };
  } else if (serviceType === "S3") {
    let readOps = faker.number.int({ min: 100, max: 50000 });
    let writeOps = faker.number.int({ min: 50, max: 10000 });

    if (anomalyType === "unattached") {
      readOps = 0;
      writeOps = 0;
    }

    return {
      cpuUtilization: 0,
      memoryUtilization: 0,
      storageSizeGB: faker.number.int({ min: 100, max: 5000 }),
      readOperations: readOps,
      writeOperations: writeOps,
    };
  }
}

async function seedDatabase() {
  try {
    console.log("📦 Connecting to MongoDB...");

    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("✓ Connected to MongoDB");

    // Clear existing data
    console.log("🧹 Clearing existing data...");
    await Resource.deleteMany({});
    await Metric.deleteMany({});
    console.log("✓ Cleared existing data");

    const resources = [];

    // Create 40 normal resources
    console.log("📝 Creating 40 normal resources...");
    for (let i = 0; i < 40; i++) {
      const serviceType = faker.helpers.arrayElement(["EC2", "S3", "RDS"]);

      let resourceId, instanceType, costPerHour;

      if (serviceType === "EC2") {
        resourceId = generateEC2ResourceId();
        instanceType = faker.helpers.arrayElement(EC2_INSTANCES);
        costPerHour = faker.number.float({
          min: 0.05,
          max: 0.20,
          fractionDigits: 3,
        });
      } else if (serviceType === "S3") {
        resourceId = generateS3BucketName();
        costPerHour = faker.number.float({
          min: 0.01,
          max: 0.08,
          fractionDigits: 3,
        });
      } else {
        resourceId = generateRDSResourceId();
        instanceType = faker.helpers.arrayElement(RDS_INSTANCES);
        costPerHour = faker.number.float({
          min: 0.08,
          max: 0.25,
          fractionDigits: 3,
        });
      }

      resources.push({
        resourceId,
        serviceType,
        region: faker.helpers.arrayElement(AWS_REGIONS),
        instanceType: instanceType || undefined,
        launchTimestamp: faker.date.past({ years: 1 }),
        status: "running",
        costPerHour,
        environment: faker.helpers.arrayElement(ENVIRONMENTS),
        department: faker.helpers.arrayElement(DEPARTMENTS),
        anomalyType: "none",
      });
    }

    // Create 5 idle resources
    console.log("📝 Creating 5 idle resources (CPU < 5%)...");
    for (let i = 0; i < 5; i++) {
      const serviceType = faker.helpers.arrayElement(["EC2", "RDS"]);
      const resourceId =
        serviceType === "EC2"
          ? generateEC2ResourceId()
          : generateRDSResourceId();
      const instanceType =
        serviceType === "EC2"
          ? faker.helpers.arrayElement(EC2_INSTANCES)
          : faker.helpers.arrayElement(RDS_INSTANCES);

      resources.push({
        resourceId,
        serviceType,
        region: faker.helpers.arrayElement(AWS_REGIONS),
        instanceType,
        launchTimestamp: faker.date.past({ years: 1 }),
        status: "running",
        costPerHour: faker.number.float({
          min: 0.05,
          max: 0.15,
          fractionDigits: 3,
        }),
        environment: faker.helpers.arrayElement(ENVIRONMENTS),
        department: faker.helpers.arrayElement(DEPARTMENTS),
        anomalyType: "idle",
      });
    }

    // Create 3 oversized instances
    console.log("📝 Creating 3 oversized instances...");
    for (let i = 0; i < 3; i++) {
      resources.push({
        resourceId: generateEC2ResourceId(),
        serviceType: "EC2",
        region: faker.helpers.arrayElement(AWS_REGIONS),
        instanceType: "t3.2xlarge",
        launchTimestamp: faker.date.past({ years: 1 }),
        status: "running",
        costPerHour: 0.35, // Projected cost over $100/mo (0.35 * 720 = $252)
        environment: faker.helpers.arrayElement(ENVIRONMENTS),
        department: faker.helpers.arrayElement(DEPARTMENTS),
        anomalyType: "oversized",
      });
    }

    // Create 2 unattached S3 storage buckets
    console.log("📝 Creating 2 unattached S3 storage buckets...");
    for (let i = 0; i < 2; i++) {
      resources.push({
        resourceId: generateS3BucketName(),
        serviceType: "S3",
        region: faker.helpers.arrayElement(AWS_REGIONS),
        launchTimestamp: faker.date.past({ years: 1 }),
        status: "running",
        costPerHour: 0.03, // Projected cost (0.03 * 720 = $21.60/mo)
        environment: faker.helpers.arrayElement(ENVIRONMENTS),
        department: faker.helpers.arrayElement(DEPARTMENTS),
        anomalyType: "unattached",
      });
    }

    // Insert all resources
    await Resource.insertMany(resources);
    console.log(`✓ Created ${resources.length} resources`);

    // Generate 30 days of hourly metrics
    console.log("📊 Generating metrics for 30 days (hourly data)...");

    const allMetrics = [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoMs = thirtyDaysAgo.getTime();

    // Create daily fluctuation factors so that daily trends look organic
    const dailyMultipliers = {};
    for (let d = 0; d <= 31; d++) {
      // Each day has its own base multiplier between 0.75 and 1.25
      dailyMultipliers[d] = 0.75 + Math.random() * 0.5;
    }

    // For each hour in the last 30 days
    for (
      let timestamp = new Date(thirtyDaysAgo);
      timestamp < new Date();
      timestamp.setHours(timestamp.getHours() + 1)
    ) {
      const dayDiff = Math.floor((timestamp.getTime() - thirtyDaysAgoMs) / (24 * 60 * 60 * 1000));
      const dailyMult = dailyMultipliers[dayDiff] !== undefined ? dailyMultipliers[dayDiff] : 1.0;

      for (const resource of resources) {
        const metrics = generateResourceMetrics(resource);
        const hourlyNoise = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
        const costIncurred = Math.round(resource.costPerHour * dailyMult * hourlyNoise * 1000) / 1000;

        allMetrics.push({
          resourceId: resource.resourceId,
          timestamp: new Date(timestamp),
          cpuUtilization: metrics.cpuUtilization,
          memoryUtilization: metrics.memoryUtilization,
          storageSizeGB: metrics.storageSizeGB,
          readOperations: metrics.readOperations,
          writeOperations: metrics.writeOperations,
          costIncurred,
        });
      }
    }

    console.log(`📝 Inserting ${allMetrics.length} metrics in bulk...`);
    await Metric.insertMany(allMetrics);
    console.log(`✓ Created ${allMetrics.length} metrics`);

    await mongoose.disconnect();
    console.log("\n✅ Database seeding completed successfully!");
    console.log(`\n📈 Summary:`);
    console.log(`   Resources: ${resources.length}`);
    console.log(`   Metrics: ${allMetrics.length}`);
    console.log(`   Data: Last 30 days of hourly metrics`);
    process.exit(0);
  } catch (error) {
    console.error("✗ Error:", error.message);
    if (mongoose.connection) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

seedDatabase();
