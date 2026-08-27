import mongoose from "mongoose";

const officerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  joiningYear: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "Officer" },
});

export default mongoose.models.Officer || mongoose.model("Officer", officerSchema, "OfficerDB");

