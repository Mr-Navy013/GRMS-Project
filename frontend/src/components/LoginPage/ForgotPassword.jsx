import React, { useState } from "react";
import "../../styles/ForgotPassword.css";

const ForgotPassword = ({ onClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [strength, setStrength] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const checkStrength = (pwd) => {
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /\d/.test(pwd)) {
      setStrength("Strong Password ✔✔");
    } else {
      setStrength("Weak Password ❌");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords are different from each other ❌");
    } else if (strength.startsWith("Strong")) {
      setShowSuccess(true);
    } else {
      setMessage("Please enter a stronger password.");
    }
  };

  return (
    <div className="forgot-card">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <label>New Password <span>*</span></label>
        <input 
          type="password" 
          value={newPassword} 
          onChange={(e) => { 
            setNewPassword(e.target.value); 
            checkStrength(e.target.value); 
          }} 
          required 
        />
        <small className={strength.startsWith("Strong") ? "strength strong" : "strength weak"}>
          {strength}
        </small>

        <label>Confirm Password <span>*</span></label>
        <input 
          type="password" 
          value={confirmPassword} 
          onChange={(e) => setConfirmPassword(e.target.value)} 
          required 
        />

        {message && (
          <p className={message.includes("successfully") ? "success-msg" : "error-msg"}>
            {message}
          </p>
        )}

        <button type="submit" className="confirm-btn">Confirm</button>
      </form>
      {/* Cancel button triggers onClose from WelcomePage */}
      <button className="close-btn" onClick={onClose}>Cancel</button>
      {/* Success Popup */}
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
