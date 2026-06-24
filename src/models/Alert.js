import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
  {
    resourceId: {
      type: String,
      required: true,
    },
    type: {
      type: String, // "Idle", "Oversized", "UnattachedStorage"
      required: true,
    },
    severity: {
      type: String, // "Critical", "High", "Medium", "Low"
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    potentialSavings: {
      type: Number,
      required: true,
    },
    currentCost: {
      type: Number,
      required: true,
    },
    environment: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["unresolved", "in progress", "resolved"],
      default: "unresolved",
    },
  },
  { timestamps: true }
);

// Compound index to ensure resourceId & type alerts are unique
AlertSchema.index({ resourceId: 1, type: 1 }, { unique: true });

export const Alert =
  mongoose.models.Alert || mongoose.model("Alert", AlertSchema);

// For CommonJS compatibility
if (typeof module !== "undefined" && module.exports) {
  module.exports = { Alert };
}
