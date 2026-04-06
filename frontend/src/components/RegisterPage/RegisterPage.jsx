import React, { useState } from "react";
import "../../styles/RegisterPage.css";

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
    universityId: ""
  });

    // Select Course
    const courses = [
      "B.tech","B.Plan","B.Arch","Int. M.tech","Int. Msc","MCA",
    ]
    // Select Department
  const departments = [
    "CSE", "IT", "AIML", "EE", "ECE", "E&I", "Mechanical", "Civil","Physics","Chemistry",
  ];
  // Generate years dynamically from 2000 to current year + 5
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = 2000; y <= currentYear + 5; y++) {
    years.push(y);
  }
   
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registering:", role, formData);
    alert(`${role} registered successfully!`);
    onClose();
  };

  return (
    <div className="register-card">
      <h2>{role} Registration</h2>
      <form onSubmit={handleSubmit}>
        {/* Common fields */}
        <label>Name <span className="required">*</span></label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />

        <label>Email <span className="required">*</span></label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        {/* Role-specific fields   Student */}
        {role === "Student" && (
          <>
            <label>Registration Number <span className="required">*</span></label>
            <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required />

            <label>Course <span className="required">*</span></label>
                <select name="course" value={formData.course} onChange={handleChange} required>
                  <option value=""> Select Course</option>  
                  {courses.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>

            <label>Department <span className="required">*</span></label>
            <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
               
            <label>Joining Year *</label>
            <select name="joiningYear" value={formData.joiningYear} onChange={handleChange} required>
              <option value="">Select Year</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select> 
          </>
        )}
           {/*Teaching Staff */}

        {role === "Teaching Staff" && (
          <>
            <label>Teaching Type <span className="required">*</span></label>
            <select name="teachingType" value={formData.teachingType} onChange={handleChange} required>
              <option value="">Select Type</option>
              <option value="Contractual">Contractual</option>
              <option value="Permanent">Permanent</option>
            </select>

            <label>Department <span className="required">*</span></label>
            <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            <label>Joining Year *</label>
            <select name="joiningYear" value={formData.joiningYear} onChange={handleChange} required>
              <option value="">Select Year</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </>
        )}

         {/* Non-Teaching Staff */}
        {role === "Non-Teaching Staff" && (
          <>
            <label>Job Role <span className="required">*</span></label>
            <input type="text" name="jobRole" value={formData.jobRole} onChange={handleChange} required />

            <label>Joining Year *</label>
            <select name="joiningYear" value={formData.joiningYear} onChange={handleChange} required>
              <option value="">Select Year</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </>
        )}
           {/* Officer */}
        {role === "Officer" && (
          <>
            <label>Department <span className="required">*</span></label>
            <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              {departments.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>

            <label>Joining Year *</label>
            <select name="joiningYear" value={formData.joiningYear} onChange={handleChange} required>
              <option value="">Select Year</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </>
        )}
          {/* Admin */}
        {role === "Admin" && (
          <>
            <label>University ID <span className="required">*</span></label>
            <input type="text" name="universityId" value={formData.universityId} onChange={handleChange} required />
          </>
        )}

        {/* Password field for all */}
        <label>Password <span className="required">*</span></label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <button type="submit">Register</button>
      </form>
      <button className="close-btn" onClick={onClose}>Cancel</button>
    </div>
  );
};

export default RegisterPage;


