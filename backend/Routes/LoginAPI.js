import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Student from "../RoleBasedSchemaModels/Student.js";
import TeachingStaff from "../RoleBasedSchemaModels/TeachingStaff.js";
import NonTeachingStaff from "../RoleBasedSchemaModels/NonTeachingStaff.js";
import Officer from "../RoleBasedSchemaModels/Officer.js";
import Admin from "../RoleBasedSchemaModels/Admin.js";

const router = express.Router();

// Fallback in-memory store if MongoDB network/cluster is unavailable
export const inMemoryUsers = [
  {
    _id: "seed_student_1",
    name: "Student 1",
    email: "student@gmail.com",
    registrationNumber: "23110662",
    course: "B.Tech",
    department: "Computer Science",
    joiningYear: 2023,
    password: "Student@123",
    role: "Student",
  },
  {
    _id: "seed_teacher_1",
    name: "Teacher 1",
    email: "teachingstaff@gmail.com",
    teachingType: "Permanent",
    department: "Computer Science",
    joiningYear: 2013,
    password: "Teacher@123",
    role: "Teaching Staff",
  },
  {
    _id: "seed_nonteacher_1",
    name: "Non-Teaching Staff 1",
    email: "nonteachingstaff@gmail.com",
    jobRole: "Clerical",
    joiningYear: 2015,
    password: "NonTeachingStaff@123",
    role: "Non-Teaching Staff",
  },
  {
    _id: "seed_officer_1",
    name: "Officer 1",
    email: "officer@gmail.com",
    department: "Computer Science",
    joiningYear: 2015,
    password: "Officer@123",
    role: "Officer",
  },
  {
    _id: "seed_admin_1",
    name: "Admin 1",
    email: "admin@gmail.com",
    universityId: "OUTR1981",
    password: "Admin@123",
    role: "Admin",
  },
];

const getModelByRole = (role) => {
  if (!role) return null;
  const normalized = role.toLowerCase().replace(/\s+|-/g, "");
  if (normalized.includes("student")) return { Model: Student, roleName: "Student" };
  if (normalized.includes("teachingstaff") && !normalized.includes("non")) return { Model: TeachingStaff, roleName: "Teaching Staff" };
  if (normalized.includes("nonteachingstaff")) return { Model: NonTeachingStaff, roleName: "Non-Teaching Staff" };
  if (normalized.includes("officer")) return { Model: Officer, roleName: "Officer" };
  if (normalized.includes("admin")) return { Model: Admin, roleName: "Admin" };
  return null;
};

// Generic login handler with MongoDB & fallback cache support
const handleLogin = async (Model, identifier, password, roleName, res) => {
  try {
    if (!identifier || !password) {
      return res.status(400).json({ error: "Email/Username and password are required" });
    }

    const trimmed = identifier.trim();
    const isDbConnected = mongoose.connection.readyState === 1;
    let user = null;

    if (isDbConnected) {
      try {
        let query;
        if (roleName === "Admin") {
          query = {
            $or: [
              { email: trimmed.toLowerCase() },
              { universityId: trimmed },
              { name: trimmed },
            ],
          };
        } else {
          query = { email: trimmed.toLowerCase() };
        }
        user = await Model.findOne(query);
      } catch (err) {
        console.warn("DB Query failed, falling back to memory store:", err.message);
      }
    }

    // Fallback search if DB is disconnected or record not found in DB
    if (!user) {
      user = inMemoryUsers.find((u) => {
        if (roleName === "Admin") {
          return (
            u.role === "Admin" &&
            ((u.email && u.email.toLowerCase() === trimmed.toLowerCase()) ||
              (u.universityId && u.universityId === trimmed) ||
              (u.name && u.name.toLowerCase() === trimmed.toLowerCase()))
          );
        }
        return (
          u.role === roleName &&
          u.email &&
          u.email.toLowerCase() === trimmed.toLowerCase()
        );
      });
    }

    if (!user) {
      return res.status(400).json({
        error: `Invalid ${roleName === "Admin" ? "Username/Email" : "email"}. Account does not exist.`,
      });
    }

    if (password !== user.password) {
      return res.status(400).json({ error: "Invalid password." });
    }

    const token = jwt.sign(
      { id: user._id || user.id, role: user.role || roleName },
      process.env.JWT_SECRET || "secretKey",
      { expiresIn: "24h" }
    );

    const userObj = user.toObject ? user.toObject() : user;

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id || user.id,
        name: user.name || user.email,
        email: user.email || user.universityId,
        role: user.role || roleName,
        ...userObj,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ error: "Login process error: " + err.message });
  }
};

// Login endpoints
router.post("/login/student", async (req, res) => {
  const { email, password } = req.body;
  await handleLogin(Student, email, password, "Student", res);
});

router.post("/login/teachingstaff", async (req, res) => {
  const { email, password } = req.body;
  await handleLogin(TeachingStaff, email, password, "Teaching Staff", res);
});

router.post("/login/non-teachingstaff", async (req, res) => {
  const { email, password } = req.body;
  await handleLogin(NonTeachingStaff, email, password, "Non-Teaching Staff", res);
});

router.post("/login/officer", async (req, res) => {
  const { email, password } = req.body;
  await handleLogin(Officer, email, password, "Officer", res);
});

router.post("/login/admin", async (req, res) => {
  const { username, email, password } = req.body;
  await handleLogin(Admin, username || email, password, "Admin", res);
});

// Registration handler
const handleRegister = async (Model, data, roleName, res) => {
  try {
    const email = data.email || data["email-ID"];
    if (!email && roleName !== "Admin") {
      return res.status(400).json({ error: "Email is required for registration." });
    }

    const trimmedEmail = email ? email.trim().toLowerCase() : "";
    const isDbConnected = mongoose.connection.readyState === 1;

    // Check duplicate in DB if connected
    if (isDbConnected && trimmedEmail) {
      try {
        const existing = await Model.findOne({ email: trimmedEmail });
        if (existing) {
          return res.status(400).json({ error: `${roleName} with this email already exists.` });
        }
      } catch (e) {
        console.warn("DB check error during registration:", e.message);
      }
    }

    // Check duplicate in memory store
    if (trimmedEmail) {
      const existingMem = inMemoryUsers.find(
        (u) => u.role === roleName && u.email && u.email.toLowerCase() === trimmedEmail
      );
      if (existingMem) {
        return res.status(400).json({ error: `${roleName} with this email already exists.` });
      }
    }

    let newUserObj = {
      _id: "user_" + Date.now(),
      ...data,
      email: trimmedEmail || data.universityId || "user@grms.com",
      role: roleName,
    };

    if (isDbConnected) {
      try {
        const doc = new Model(newUserObj);
        await doc.save();
        newUserObj = doc.toObject();
      } catch (err) {
        console.warn("DB save failed, using memory store:", err.message);
      }
    }

    // Save to memory store as well
    inMemoryUsers.push(newUserObj);

    return res.status(201).json({
      message: `${roleName} registered successfully!`,
      user: newUserObj,
    });
  } catch (err) {
    console.error("Registration Error:", err);
    return res.status(400).json({ error: err.message || "Registration failed" });
  }
};

// Registration endpoints
router.post("/register/student", async (req, res) => {
  await handleRegister(Student, req.body, "Student", res);
});

router.post("/register/teachingstaff", async (req, res) => {
  await handleRegister(TeachingStaff, req.body, "Teaching Staff", res);
});

router.post("/register/non-teachingstaff", async (req, res) => {
  await handleRegister(NonTeachingStaff, req.body, "Non-Teaching Staff", res);
});

router.post("/register/officer", async (req, res) => {
  await handleRegister(Officer, req.body, "Officer", res);
});

router.post("/register/admin", async (req, res) => {
  await handleRegister(Admin, req.body, "Admin", res);
});

// Password Reset Endpoint
router.post("/forgot-password", async (req, res) => {
  try {
    const { email, newPassword, role } = req.body;
    let models = [Student, TeachingStaff, NonTeachingStaff, Officer, Admin];

    if (role) {
      const target = getModelByRole(role);
      if (target) models = [target.Model];
    }

    let updated = false;
    const trimmedEmail = email ? email.trim().toLowerCase() : "";

    // Update in DB if connected
    if (mongoose.connection.readyState === 1 && trimmedEmail) {
      for (const Model of models) {
        try {
          const user = await Model.findOne({ email: trimmedEmail });
          if (user) {
            user.password = newPassword;
            await user.save();
            updated = true;
            break;
          }
        } catch (e) {
          console.warn("DB update password error:", e.message);
        }
      }
    }

    // Update in memory store
    for (const u of inMemoryUsers) {
      if (!trimmedEmail || (u.email && u.email.toLowerCase() === trimmedEmail)) {
        u.password = newPassword;
        updated = true;
        break;
      }
    }

    if (updated || !trimmedEmail) {
      return res.status(200).json({ message: "Password updated successfully!" });
    } else {
      return res.status(404).json({ error: "User email not found." });
    }
  } catch (err) {
    console.error("Password reset error:", err);
    return res.status(500).json({ error: "Password update failed: " + err.message });
  }
});

export default router;
