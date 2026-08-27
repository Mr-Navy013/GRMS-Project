import React, { useState } from "react";
import "./SharedComponents.css";

const CustomSelectModal = ({ label, value, options, onSelect, placeholder = "Select Option" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-select-field-wrapper">
      {label && <label className="input-label">{label}</label>}

      {/* Trigger Box */}
      <div
        className="custom-select-trigger"
        onClick={() => setIsOpen(true)}
        role="button"
        tabIndex={0}
      >
        <span className={value ? "trigger-text-selected" : "trigger-text-placeholder"}>
          {value || placeholder}
        </span>
        <span className="trigger-arrow">▼</span>
      </div>

      {/* Modal Popup on Screen */}
      {isOpen && (
        <div className="modal-overlay-backdrop modal-high-zindex" onClick={() => setIsOpen(false)}>
          <div className="custom-select-popup-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="custom-select-popup-header">
              <h4>{label ? `Select ${label.replace("*", "").trim()}` : "Select Option"}</h4>
              <button
                type="button"
                className="modal-close-x-btn"
                onClick={() => setIsOpen(false)}
              >
                ✖
              </button>
            </div>

            <div className="custom-select-options-list">
              {options.map((opt) => (
                <div
                  key={String(opt)}
                  className={`custom-select-option-item ${String(value) === String(opt) ? "selected" : ""}`}
                  onClick={() => handleOptionClick(opt)}
                >
                  <span>{opt}</span>
                  {String(value) === String(opt) && <span className="option-check">✓</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelectModal;
