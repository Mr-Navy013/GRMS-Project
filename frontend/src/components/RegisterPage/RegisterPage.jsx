import React, { useState } from "react";
import "../../styles/RegisterPage.css";
import axios from "axios";
import CustomSelectModal from "../Shared/CustomSelectModal";

const RegisterPage = ({ role, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    course: "",
    joiningYear: "",
    password: "",
    registrationNumber: "",
    teachingType: "",
    jobRole: "",
    universityId: "",
  });

  const [apiMsg, setApiMsg] = useState({ type: "", text: "" });

  const courses = ["B.tech", "B.Plan", "B.Arch", "Int. M.tech", "Int. Msc", "MCA"];
  const departments = ["CSE", "IT", "AIML", "EE", "ECE", "E&I", "Mechanical", "Civil", "Physics", "Chemistry"];

  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = 2000; y <= currentYear + 5; y++) {
    years.push(y);
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setApiMsg({ type: "", text: "" });
  };

  const handleSelectField = (fieldName, selectedVal) => {
    setFormData({ ...formData, [fieldName]: selectedVal });
    setApiMsg({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiMsg({ type: "", text: "" });
    try {
      const roleSlug = role.toLowerCase().replace(/\s+/g, "");
      const res = await axios.post(`http://localhost:5000/api/register/${roleSlug}`, formData);
      setApiMsg({ type: "success", text: res.data.message || "Registered successfully!" });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setApiMsg({ type: "error", text: err.response?.data?.error || "Registration failed" });
    }
  };

  return (
    <div className="register-card-wrapper" onClick={onClose}>
      <div className="register-card" onClick={(e) => e.stopPropagation()}>
        <h2>{role} Registration</h2>

        {apiMsg.text && (
          <div className={`alert-banner ${apiMsg.type}`} style={{ marginBottom: "1rem" }}>
            {apiMsg.type === "success" ? "✅ " : "❌ "}
            {apiMsg.text}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          {/* Common fields */}
          <div className="form-group-reg">
            <label className="input-label">Name <span className="required" style={{ color: "#ef4444" }}>*</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter full name" />
          </div>

          <div className="form-group-reg">
            <label className="input-label">Email <span className="required" style={{ color: "#ef4444" }}>*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter email address" />
          </div>

          {/* Student fields */}
          {role === "Student" && (
            <>
              <div className="form-group-reg">
                <label className="input-label">Registration Number <span className="required" style={{ color: "#ef4444" }}>*</span></label>
                <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required placeholder="Enter registration number" />
              </div>

              <CustomSelectModal
                label="Course *"
                value={formData.course}
                options={courses}
                onSelect={(val) => handleSelectField("course", val)}
                placeholder="Select Course"
              />

              <CustomSelectModal
                label="Department *"
                value={formData.department}
                options={departments}
                onSelect={(val) => handleSelectField("department", val)}
                placeholder="Select Department"
              />

              <CustomSelectModal
                label="Joining Year *"
                value={formData.joiningYear}
                options={years}
                onSelect={(val) => handleSelectField("joiningYear", val)}
                placeholder="Select Year"
              />
            </>
          )}

          {/* Teaching Staff fields */}
          {role === "Teaching Staff" && (
            <>
              <CustomSelectModal
                label="Teaching Type *"
                value={formData.teachingType}
                options={["Contractual", "Permanent"]}
                onSelect={(val) => handleSelectField("teachingType", val)}
                placeholder="Select Type"
              />

              <CustomSelectModal
                label="Department *"
                value={formData.department}
                options={departments}
                onSelect={(val) => handleSelectField("department", val)}
                placeholder="Select Department"
              />

              <CustomSelectModal
                label="Joining Year *"
                value={formData.joiningYear}
                options={years}
                onSelect={(val) => handleSelectField("joiningYear", val)}
                placeholder="Select Year"
              />
            </>
          )}

          {/* Non-Teaching Staff fields */}
          {role === "Non-Teaching Staff" && (
            <>
              <div className="form-group-reg">
                <label className="input-label">Job Role <span className="required" style={{ color: "#ef4444" }}>*</span></label>
                <input type="text" name="jobRole" value={formData.jobRole} onChange={handleChange} required placeholder="Enter job role" />
              </div>

              <CustomSelectModal
                label="Joining Year *"
                value={formData.joiningYear}
                options={years}
                onSelect={(val) => handleSelectField("joiningYear", val)}
                placeholder="Select Year"
              />
            </>
          )}

          {/* Officer fields */}
          {role === "Officer" && (
            <>
              <CustomSelectModal
                label="Department *"
                value={formData.department}
                options={departments}
                onSelect={(val) => handleSelectField("department", val)}
                placeholder="Select Department"
              />

              <CustomSelectModal
                label="Joining Year *"
                value={formData.joiningYear}
                options={years}
                onSelect={(val) => handleSelectField("joiningYear", val)}
                placeholder="Select Year"
              />
            </>
          )}

          {/* Admin fields */}
          {role === "Admin" && (
            <div className="form-group-reg">
              <label className="input-label">University ID <span className="required" style={{ color: "#ef4444" }}>*</span></label>
              <input type="text" name="universityId" value={formData.universityId} onChange={handleChange} required placeholder="Enter University ID" />
            </div>
          )}

          {/* Password field */}
          <div className="form-group-reg">
            <label className="input-label">Password <span className="required" style={{ color: "#ef4444" }}>*</span></label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Enter password" />
          </div>

          <button type="submit" className="register-submit-btn">Register</button>
        </form>
        <button type="button" className="register-cancel-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default RegisterPage;
