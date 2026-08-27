import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  universityId: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "Admin" },
});

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema, "AdminDB");

