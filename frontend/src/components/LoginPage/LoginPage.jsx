import React, { useState } from "react";
import "../../styles/LoginPage.css";
import axios from "axios";

const LoginPage = ({ role, onClose, setShowForgotPassword, onLoginSuccess }) => {
  const [emailOrUser, setEmailOrUser] = useState("");
  const [password, setPassword] = useState("");
  const [errorField, setErrorField] = useState({ email: "", password: "" });
  const [apiError, setApiError] = useState("");

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
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
      try {
        const requestBody = role === "Admin"
          ? { username: emailOrUser, password }
          : { email: emailOrUser, password };

        const roleSlug = role.toLowerCase().replace(/\s+/g, "");
        const res = await axios.post(`http://localhost:5000/api/login/${roleSlug}`, requestBody);

        localStorage.setItem("token", res.data.token);
        onLoginSuccess(role, res.data.user);
        onClose();
      } catch (err) {
        setApiError(err.response?.data?.error || "Login failed. Please check credentials.");
      }
    }
  };

  return (
    <div className="login-card-wrapper" onClick={onClose}>
      <div className="login-card" onClick={(e) => e.stopPropagation()}>
        <h2>{role} Login</h2>
        
        {apiError && (
          <div className="alert-banner error" style={{ marginBottom: "1rem" }}>
            ❌ {apiError}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group-login">
            <label className="input-label">
              {role === "Admin" ? "Username" : `${role}'s Email / Username`} <span className="required" style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type={role === "Admin" ? "text" : "email"}
              placeholder="Username / Email"
              value={emailOrUser}
              onChange={(e) => {
                setEmailOrUser(e.target.value);
                setApiError("");
              }}
              className={errorField.email ? "error-input" : ""}
              autoComplete="off"
              required
            />
            {errorField.email && <p className="error-msg" style={{ color: "#ef4444", fontSize: "0.8rem", margin: "2px 0 0 0" }}>{errorField.email}</p>}
          </div>

          <div className="form-group-login">
            <label className="input-label">
              Password <span className="required" style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setApiError("");
              }}
              className={errorField.password ? "error-input" : ""}
              autoComplete="new-password"
              required
            />
            {errorField.password && <p className="error-msg" style={{ color: "#ef4444", fontSize: "0.8rem", margin: "2px 0 0 0" }}>{errorField.password}</p>}
          </div>

          <div className="forgot-password-link">
            <span onClick={(e) => {
              e.preventDefault();
              onClose(); 
              setShowForgotPassword(true); 
            }}>
              Forgot / Change Password?
            </span>
          </div>

          <button type="submit" className="login-submit-btn">Login</button>
        </form>

        <button type="button" className="close-btn" onClick={onClose}>
          Cancel Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
