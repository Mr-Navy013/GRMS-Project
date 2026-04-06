import React, { useState } from "react";
import "../../styles/ContactSupport.css";

const ContactSupport = ({ userEmail, onClose }) => {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    console.log("Sending support message:", {
      from: userEmail,
      to: "navycutdehury@gmail.com",
      subject,
      description,
    });
    setShowSuccess(true);
  };

  return (
    <div className="cs-overlay" onClick={onClose}>
      <div className="cs-popup" onClick={(e) => e.stopPropagation()}>
        <h2>Contact Support</h2>
        <form onSubmit={handleSend}>
          <label>From <span>*</span></label>
          <input type="email" placeholder={userEmail}  required />

          <label>To <span>(fixed-email)</span></label>
          <input type="email" value="navycutdehury@gmail.com"  required />

          <label>Subject <span>*</span></label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <label>Description <span>*</span></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
          />

          <div className="cs-button-group">
            <button type="submit" className="cs-send-btn">Send</button>
            <button type="button" className="cs-close-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
         {/* Success Popup */}
        {showSuccess && (
          <div className="cs-success-popup">
            <p>✅ Your message has been sent successfully!</p>
            <button onClick={() => { setShowSuccess(false); onClose(); }}>OK</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSupport;
