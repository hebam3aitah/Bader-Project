import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String, required: true },
  location: { type: String },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
  images: [{ type: String }],
  status: {
    type: String,
    enum: ["in-progress", "completed"],
    default: "in-progress",
  },
  priority: {
    type: String,
    enum: ["urgent", "medium", "low"],
    default: "medium",
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  likesCount: { type: Number, default: 0 },
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
  ],
  issue: { type: mongoose.Schema.Types.ObjectId, ref: "Issue" },
  donationTarget: { type: Number, default: 0 },
  volunteerCount: { type: Number, default: 0 },
  volunteerHours: { type: Number, default: 0 },
  createdFromIssue: { type: mongoose.Schema.Types.ObjectId, ref: "Issue" },
  lastStatusUpdate: { type: Date, default: Date.now },
  donations: { type: Number, default: 0 },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  organization: { type: mongoose.Schema.Types.ObjectId, ref: "Organization" },
  mainImage: { type: String }, // ✅ الحقل المفقود
  locationLat: { type: Number, default: 0 },
  locationLng: { type: Number, default: 0 },
  locationName: { type: String, default: "" }, // نتيجة reverse geocoding
  shareCount: { type: Number, default: 0 },
  reportedAt: { type: Date },
});
projectSchema.index({ title: "text", description: "text", location: "text" });

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
