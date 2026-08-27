import React, { useState } from "react";
import "./SharedComponents.css";

const CATEGORIES = [
  { id: "Academic", title: "Academic", desc: "Exams, marks, timetable & academic issues" },
  { id: "Hostel", title: "Hostel", desc: "Room allocation, mess food, Wi-Fi & maintenance" },
  { id: "Infrastructure", title: "Infrastructure", desc: "Labs, classrooms, water coolers & facilities" },
  { id: "Faculty", title: "Faculty", desc: "Teaching staff, guidance & course queries" },
  { id: "Other", title: "Other", desc: "Custom or miscellaneous grievances" },
];

const CategoryPopupSelect = ({ selectedCategory, onSelectCategory }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleOptionClick = (catId) => {
    onSelectCategory(catId);
    setIsPopupOpen(false);
  };

  const selectedItem = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  return (
    <div className="category-select-wrapper">
      <label className="form-field-label">Select Category *</label>

      {/* Styled Select Input Trigger Box */}
      <div
        className="category-select-trigger-box"
        onClick={() => setIsPopupOpen(true)}
        role="button"
        tabIndex={0}
      >
        <div className="selected-category-display">
          <span className="cat-text">{selectedItem.title}</span>
        </div>
        <span className="dropdown-arrow-icon">▼</span>
      </div>

      {/* Category Selection Modal Popup */}
      {isPopupOpen && (
        <div className="modal-overlay-backdrop modal-high-zindex" onClick={() => setIsPopupOpen(false)}>
          <div
            className="category-popup-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="category-popup-header">
              <div className="popup-header-title">
                <h3>Select Grievance Category</h3>
                <p>Choose the category that best describes your grievance</p>
              </div>
              <button
                type="button"
                className="modal-close-x-btn"
                onClick={() => setIsPopupOpen(false)}
              >
                ✖
              </button>
            </div>

            <div className="category-popup-options-grid">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className={`category-option-card ${selectedCategory === cat.id ? "active-selected" : ""}`}
                  onClick={() => handleOptionClick(cat.id)}
                >
                  <div className="option-text-group">
                    <strong className="option-title">{cat.title}</strong>
                    <span className="option-desc">{cat.desc}</span>
                  </div>
                  {selectedCategory === cat.id && (
                    <span className="selected-check-badge">✓</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPopupSelect;
