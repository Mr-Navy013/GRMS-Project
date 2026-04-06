import React, { useState } from "react";
import "../../styles/WelcomePage.css";
import DropDownOption from "./DropDownOption.jsx";
import LoginPage from "../LoginPage/LoginPage.jsx";
import RegisterPage from "../RegisterPage/RegisterPage.jsx";
import ForgotPasswordPopup from "../LoginPage/ForgotPassword.jsx";
import ContactSupport from "./ContactSupport.jsx";  


const WelcomePage = ({onLoginSuccess}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeButton, setActiveButton] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const [selectedRegisterRole, setSelectedRegisterRole] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSupport, setShowSupport] = useState(false);



  const handleClick = (buttonType) => {
    setActiveButton(buttonType);
    setShowDropdown(true);
  };

  // close handle for forgot password popup 
  const handleForgotCancel = () => {
    setShowForgotPassword(false);
    setSelectedRole(selectedRole);
  };

  const handleClose = () => {
    setShowDropdown(false);
    setActiveButton("");
    setSelectedRole("");   
    setShowRegisterDropdown(false);   // register states reset
    setSelectedRegisterRole("");
    setShowForgotPassword(false);     // forgot password state reset
  };

  return (
    <div className="welcome-container">
      <header className="welcome-header">
        <h2 className="sub-heading">Welcome To The</h2>
        <h1 className="main-heading">GRIEVANCE REDRESSAL MANAGEMENT SYSTEM</h1>
      </header>

      <div className="button-group">
        <button className="btn login-btn" onClick={() => handleClick("Login")}>
          Login
        </button>
        <h4>
          Don't Have an Account ? 
          <button 
            type="button" 
            className="link-btn" 
            onClick={(e) => {
              e.stopPropagation();
              setShowRegisterDropdown(true);
            }}
          >
            Register Now
          </button>
        </h4>
      </div>

      {/* Login Dropdown */}
      {showDropdown && (
        <div className="overlay" onClick={handleClose}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <DropDownOption
              activeButton={activeButton}
              onSelect={(role) => {
                setSelectedRole(role);
                setShowDropdown(false);
              }}
            />
            <button className="dropdown-close-btn" onClick={handleClose}>Close</button>
          </div>
        </div>
      )}

      {/* Login Form */}
      {selectedRole && !showForgotPassword && (
        <div className="overlay" onClick={handleClose}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <LoginPage 
              role={selectedRole} 
              onClose={handleClose} 
              setShowForgotPassword={setShowForgotPassword} 
              onLoginSuccess={onLoginSuccess}
            />
          </div>
        </div>
      )}

      {/* Register Dropdown */}
      {showRegisterDropdown && (
        <div className="overlay" onClick={handleClose}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <DropDownOption
              activeButton="Register"
              onSelect={(role) => {
                setSelectedRegisterRole(role);
                setShowRegisterDropdown(false);
              }}
            />
            <button className="dropdown-close-btn" onClick={handleClose}>Close</button>
          </div>
        </div>
      )}

      {/* Register Form */}
      {selectedRegisterRole && (
        <div className="overlay" onClick={handleClose}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <RegisterPage role={selectedRegisterRole} onClose={handleClose} />
          </div>
        </div>
      )}

      {/* Forgot Password Popup */}
      {showForgotPassword && (
        <div className="overlay" onClick={() => setShowForgotPassword(false)}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <ForgotPasswordPopup onClose={handleForgotCancel} />
          </div>
        </div>
      )}

      {/* Footer */}
    <footer className="footer">
  <h4>
    &#128222; Need Assistance?{" "}
    <button 
      type="button" 
      className="support-link" 
      onClick={() => setShowSupport(true)}
    >
      Contact Support
    </button>
  </h4>
</footer>

{showSupport && (
  <ContactSupport 
    userEmail="user@example.com"
    onClose={() => setShowSupport(false)} 
  />
)}


    </div>
  );
};

export default WelcomePage;
