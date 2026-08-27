import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registrationNumber: { type: mongoose.Schema.Types.Mixed, required: true },
  course: { type: String, required: true },
  department: { type: String, required: true },
  joiningYear: { type: Number, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "Student" },
});

export default mongoose.models.Student || mongoose.model("Student", studentSchema, "StudentDB");
