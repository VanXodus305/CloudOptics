import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // Expire documents after 10 minutes
    },
  }
);

export const Otp = mongoose.models.Otp || mongoose.model('Otp', OtpSchema);
