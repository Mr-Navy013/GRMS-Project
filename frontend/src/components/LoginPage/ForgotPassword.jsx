import React, { useState } from "react";
import "../../styles/ForgotPassword.css";
import axios from "axios";
import { getApiUrl } from "../../utils/apiConfig";

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [strength, setStrength] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const checkStrength = (pwd) => {
    if (pwd.length >= 6 && /\d/.test(pwd)) {
      setStrength("Strong Password ✔✔");
    } else {
      setStrength("Weak Password (min 6 chars, include numbers) ❌");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match ❌");
      return;
    }

    try {
      const res = await axios.post(getApiUrl("/api/forgot-password"), {
        email,
        newPassword,
      });
      setMessage(res.data.message || "Password updated successfully!");
      setShowSuccess(true);
    } catch (err) {
      setMessage(err.response?.data?.error || "Password update failed ❌");
    }
  };

  return (
    <div className="forgot-card">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <label>Enter Registered Email <span>*</span></label>
        <input 
          type="email" 
          value={email}
          placeholder="your.email@gmail.com"
          onChange={(e) => {
            setEmail(e.target.value);
            setMessage("");
          }}
          required 
        />

        <label>New Password <span>*</span></label>
        <input 
          type="password" 
          value={newPassword} 
          placeholder="Enter New Password"
          onChange={(e) => { 
            setNewPassword(e.target.value); 
            checkStrength(e.target.value);
            setMessage("");
          }} 
          required 
        />
        {strength && (
          <small className={strength.startsWith("Strong") ? "strength strong" : "strength weak"}>
            {strength}
          </small>
        )}

        <label>Confirm New Password <span>*</span></label>
        <input 
          type="password" 
          value={confirmPassword} 
          placeholder="Confirm New Password"
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setMessage("");
          }} 
          required 
        />

        {message && (
          <p className={showSuccess ? "success-msg" : "error-msg"} style={{ marginTop: "0.5rem" }}>
            {message}
          </p>
        )}

        <button type="submit" className="confirm-btn">Confirm Change</button>
      </form>

      <button className="close-btn" onClick={onClose}>Cancel</button>

      {showSuccess && (
        <div className="success-popup">
          <p>✅ Password has been changed successfully!</p>
          <button onClick={() => { setShowSuccess(false); onClose(); }}>OK</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
