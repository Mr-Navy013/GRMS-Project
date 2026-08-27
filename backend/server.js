import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import LoginAPI from "./Routes/LoginAPI.js";

import Student from "./RoleBasedSchemaModels/Student.js";
import TeachingStaff from "./RoleBasedSchemaModels/TeachingStaff.js";
import NonTeachingStaff from "./RoleBasedSchemaModels/NonTeachingStaff.js";
import Officer from "./RoleBasedSchemaModels/Officer.js";
import Admin from "./RoleBasedSchemaModels/Admin.js";

const app = express();

app.use(express.json());
app.use(cors());

// Prevent process exit on unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.warn("⚠️ Unhandled Rejection:", reason?.message || reason);
});
process.on("uncaughtException", (err) => {
  console.warn("⚠️ Uncaught Exception:", err?.message || err);
});

// Mount API routes
app.use("/api", LoginAPI);

const MONGO_URI = process.env.MONGODB_URL || "mongodb+srv://navycutdehury:Navy%401234@grievance.qiez47o.mongodb.net/grievance?retryWrites=true&w=majority";

const seedDefaultUsers = async () => {
  try {
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      await Student.create({
        name: "Student 1",
        email: "student@gmail.com",
        registrationNumber: 23110662,
        course: "B.Tech",
        department: "Computer Science",
        joiningYear: 2023,
        password: "Student@123",
        role: "Student",
      });
      console.log("✅ Default Student account created: student@gmail.com / Student@123");
    }

    const teacherCount = await TeachingStaff.countDocuments();
    if (teacherCount === 0) {
      await TeachingStaff.create({
        name: "Teacher 1",
        email: "teachingstaff@gmail.com",
        teachingType: "Permanent",
        department: "Computer Science",
        joiningYear: 2013,
        password: "Teacher@123",
        role: "Teaching Staff",
      });
      console.log("✅ Default Teaching Staff account created: teachingstaff@gmail.com / Teacher@123");
    }

    const nonTeacherCount = await NonTeachingStaff.countDocuments();
    if (nonTeacherCount === 0) {
      await NonTeachingStaff.create({
        name: "Non-Teaching Staff 1",
        email: "nonteachingstaff@gmail.com",
        jobRole: "Clerical",
        joiningYear: 2015,
        password: "NonTeachingStaff@123",
        role: "Non-Teaching Staff",
      });
      console.log("✅ Default Non-Teaching Staff account created: nonteachingstaff@gmail.com / NonTeachingStaff@123");
    }

    const officerCount = await Officer.countDocuments();
    if (officerCount === 0) {
      await Officer.create({
        name: "Officer 1",
        email: "officer@gmail.com",
        department: "Computer Science",
        joiningYear: 2015,
        password: "Officer@123",
        role: "Officer",
      });
      console.log("✅ Default Officer account created: officer@gmail.com / Officer@123");
    }

    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({
        name: "Admin 1",
        email: "admin@gmail.com",
        universityId: "OUTR1981",
        password: "Admin@123",
        role: "Admin",
      });
      console.log("✅ Default Admin account created: admin@gmail.com or OUTR1981 / Admin@123");
    }
  } catch (err) {
    console.warn("⚠️ Seeding error:", err.message);
  }
};

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 })
  .then(async () => {
    console.log("✅ MongoDB Connected Successfully");
    await seedDefaultUsers();
  })
  .catch((err) => {
    console.warn("⚠️ MongoDB connection notice:", err.message, "| Operating in fault-tolerant mode.");
  });

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Keep event loop alive
setInterval(() => {}, 60000);
