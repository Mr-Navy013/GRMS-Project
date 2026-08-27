const express = require("express");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const router = express.Router();

// Register Student
router.post("/register/student", async (req, res) => {
  try {
    const { name, "email-ID":emailID, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      name,
      "email-ID": emailID,
      password: hashedPassword,
    });
    await newStudent.save();

    res.json({ message: "Student registered successfully!" });
  } catch (err) {
    res.status(400).json({ error: "Email already exists or invalid data" });
  }
});

module.exports = router;
