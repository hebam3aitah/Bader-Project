
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  donatedAt: { type: Date, default: Date.now },

  isGeneral: { type: Boolean, default: false },

  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: false },

  // ✅ دعم التبرع لجهة (منظمة)
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: false },

  method: {
    type: String,
    enum: ['credit', 'paypal', 'bank'],
    default: 'credit'
  }
});

export default mongoose.models.Donation || mongoose.model("Donation", donationSchema);
