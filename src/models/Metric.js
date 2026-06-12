import mongoose from "mongoose";

const MetricSchema = new mongoose.Schema(
  {
    resourceId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
    cpuUtilization: {
      type: Number,
      min: 0,
      max: 100,
    },
    memoryUtilization: {
      type: Number,
      min: 0,
      max: 100,
    },
    storageSizeGB: {
      type: Number,
    },
    readOperations: {
      type: Number,
      default: 0,
    },
    writeOperations: {
      type: Number,
      default: 0,
    },
    costIncurred: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export const Metric =
  mongoose.models.Metric || mongoose.model("Metric", MetricSchema);

// For CommonJS compatibility
if (typeof module !== "undefined" && module.exports) {
  module.exports = { Metric };
}
