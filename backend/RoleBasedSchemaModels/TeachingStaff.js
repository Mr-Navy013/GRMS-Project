import mongoose from "mongoose";

const teachingStaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  teachingType: { type: String, enum: ["Contractual", "Permanent"], required: true },
  department: { type: String, required: true },
  joiningYear: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "Teaching Staff" },
});

export default mongoose.models.TeachingStaff || mongoose.model("TeachingStaff", teachingStaffSchema, "TeachingStaffDB");

