import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    bio: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    image: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    email: {
      type: String,
      trim: true,
    },
    github: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    resumeLink: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// We generally only need one profile, but using standard collection logic
if (process.env.NODE_ENV !== 'production') {
  delete mongoose.models.Profile;
}
export default mongoose.models.Profile || mongoose.model("Profile", profileSchema);
