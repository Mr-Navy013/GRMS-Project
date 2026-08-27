import React, { useState, useRef } from "react";
import "./SharedComponents.css";

const DragDropUpload = ({ onFileSelected, selectedFileName = "", accept = ".pdf,.png,.jpg,.jpeg,.doc,.docx" }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (onFileSelected) {
        onFileSelected(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (onFileSelected) {
        onFileSelected(file);
      }
    }
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    if (onFileSelected) {
      onFileSelected(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className={`drag-drop-dropzone ${isDragActive ? "drag-over" : ""} ${selectedFileName ? "has-file" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current && fileInputRef.current.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        style={{ display: "none" }}
      />

      {selectedFileName ? (
        <div className="file-selected-badge">
          <div className="file-info-left">
            <span className="file-icon">📎</span>
            <div className="file-details">
              <strong className="file-name">{selectedFileName}</strong>
              <small className="file-status-tag">Ready to upload</small>
            </div>
          </div>
          <button
            type="button"
            className="remove-file-btn"
            onClick={handleRemoveFile}
            title="Remove selected file"
          >
            ✖
          </button>
        </div>
      ) : (
        <div className="drag-drop-prompt">
          <div className="cloud-upload-icon">☁️</div>
          <p className="drag-drop-title">
            <strong>Drag & Drop your file here</strong>
          </p>
          <span className="drag-drop-subtext">or click to browse from device ({accept})</span>
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;
