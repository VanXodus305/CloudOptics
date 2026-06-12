import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema(
  {
    resourceId: {
      type: String,
      required: true,
      unique: true,
    },
    serviceType: {
      type: String,
      enum: ["EC2", "S3", "RDS"],
      required: true,
    },
    region: {
      type: String,
      default: "us-east-1",
    },
    instanceType: {
      type: String,
    },
    launchTimestamp: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["running", "stopped", "terminated"],
      default: "running",
    },
    costPerHour: {
      type: Number,
      required: true,
    },
    environment: {
      type: String,
      enum: ["Production", "Development", "Testing"],
      default: "Production",
    },
    department: {
      type: String,
      enum: ["Engineering", "Marketing", "Data Science"],
      default: "Engineering",
    },
  },
  { timestamps: true },
);

export const Resource =
  mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);

// For CommonJS compatibility
if (typeof module !== "undefined" && module.exports) {
  module.exports = { Resource };
}
