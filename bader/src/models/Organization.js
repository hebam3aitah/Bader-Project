const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Issue" }],
  location: { type: String },
  totalDonations: { type: Number, default: 0 },
  email: { type: String, required: true },
  contactPerson: { type: String }, // اسم مسؤول الجهة
  phone: { type: String },
  supportType: { type: String, required: true },
  message: { type: String },
  images: [
    {
      url: { type: String },
      uploadedAt: { type: Date, default: Date.now },
    },
  ],
  category: {
    type: String,
    enum: ["companies", "governmental", "ngos"],
    default: "ngos",
  },
  registeredAt: { type: Date, default: Date.now },
  approved: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
});

export default mongoose.models.Organization ||
  mongoose.model("Organization", organizationSchema);
