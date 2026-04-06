import React, { useState } from "react";
import "../../styles/LoginPage.css";

const LoginPage = ({ role, onClose, setShowForgotPassword,onLoginSuccess  }) => {
  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");
  const [errorField, setErrorField] = useState({ email: "", password: "" });

  // Role-based placeholder examples
  const placeholderMap = {
    Student: "Ex- student@gmail.com",
    "Teaching Staff": "Ex- teachingstaff@gmail.com",
    "Non-Teaching Staff": "Ex- nonteachingstaff@gmail.com",
    Officer: "Ex- officer@gmail.com",
    Admin: "Ex- admin@gmail.com",
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let errors = { email: "", password: "" };

    if (!emailOrUser) {
      errors.email = "Please enter your Email-ID/Username.";
    } else if (role !== "Admin" && !validateEmail(emailOrUser)) {
      errors.email = "Invalid Email format.";
    }

    if (!password) {
      errors.password = "Please enter your Password.";
    }

    setErrorField(errors);

    if (!errors.email && !errors.password) {
      console.log(`${role} login with ${emailOrUser} and Password ${password}`);
      onLoginSuccess(role);
      onClose();  
    }
  };

  return (
    <div className="login-card">
      <h2>{role} Login</h2>
      <form onSubmit={handleSubmit}>
        <label className="input-label">
          Enter {role === "Admin" ? "Username" : `${role}'s Email-ID`} <span className="required">*</span>
        </label>
        {role === "Admin" ? (
          <input
            type="text"
            placeholder={errorField.email || placeholderMap[role] || "Enter Username"}
            value={emailOrUser}
            onChange={(e) => setEmailOrUser(e.target.value)}
            className={errorField.email ? "error-input" : ""}
          />
        ) : (
          <input
            type="email"
            placeholder={errorField.email || placeholderMap[role] || `${role}'s Email-ID`}
            value={emailOrUser}
            onChange={(e) => setEmailOrUser(e.target.value)}
            className={errorField.email ? "error-input" : ""}
          />
        )}

        <label className="input-label">
          Enter Password <span className="required">*</span>
        </label>
        <input
          type="password"
          placeholder={errorField.password || "Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={errorField.password ? "error-input" : ""}
        />

        <small className="forgot-password">
          <a href="#" onClick={(e) => {
            e.preventDefault();
            onClose(); 
            setShowForgotPassword(true); 
          }}>
            Forgot / Change Password?
          </a>
        </small>

        <button type="submit">Login</button>
      </form>
      <button className="close-btn" onClick={onClose}>
        Cancel Login
      </button>
    </div>
  );
};

export default LoginPage;
