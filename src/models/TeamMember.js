import mongoose, { Schema } from "mongoose";

const TeamMemberSchema = new Schema({
  name: String,
  role: String,
  bio: String,
  image: String,
  links: {
    Facebook: String,
    Whatsapp: String,
  }
});

export default mongoose.models.TeamMember || mongoose.model("TeamMember", TeamMemberSchema);
