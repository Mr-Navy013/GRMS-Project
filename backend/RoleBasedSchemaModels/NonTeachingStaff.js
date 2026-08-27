import mongoose from "mongoose";

const nonTeachingStaffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  jobRole: { type: String, required: true },
  joiningYear: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "Non-Teaching Staff" },
});

export default mongoose.models.NonTeachingStaff || mongoose.model("NonTeachingStaff", nonTeachingStaffSchema, "NonTeachingStaffDB");

