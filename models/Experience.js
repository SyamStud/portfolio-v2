import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide a company name"],
      trim: true,
    },
    role: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Please provide your role"],
    },
    startDate: {
      type: Date,
      required: [true, "Please provide a start date"],
    },
    endDate: {
      type: Date, // If null, means 'Present'
    },
    current: {
      type: Boolean,
      default: false,
    },
    description: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Please provide a description of your experience"],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Experience || mongoose.model("Experience", experienceSchema);
