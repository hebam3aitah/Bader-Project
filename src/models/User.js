import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    validate: {
      validator: function (v) {
        return this.provider === 'google' || (v && v.length > 0);
      },
      message: 'كلمة المرور مطلوبة للحسابات اليدوية',
    },
  },
  provider: { type: String, enum: ['local', 'google'], default: 'local' },
  role: { type: String, enum: ["user", "admin", "volunteer" , "donor" , "supporter"], default: "user" },
  image: { type: String },
  profilePicture: { type: String, default: "" },
  age: { type: Number },
  address: { type: String },
  phone: { type: String },
  profession: { type: String },
  experience: { type: String },
  birthDate: { type: Date },
  IsConfirmed: { type: Boolean, default: false },
  registrationDate: { type: Date, default: Date.now },
  otp: { type: String },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
