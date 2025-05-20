import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    volunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    age: { type: Number },
    job: { type: String },
    task: { type: String, required: true },
    experience: { type: String },
    interests: { type: String },
    availability: { type: String },
    projectAssigned: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    notes: { type: String },
    messages: [
      {
        sender: { type: String, enum: ["admin", "volunteer"], required: true },
        message: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
      },
    ],
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Volunteer || mongoose.model("Volunteer", volunteerSchema);
