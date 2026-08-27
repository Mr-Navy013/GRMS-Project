import React from "react";
import "./SharedComponents.css";

const CancelConfirmModal = ({ isOpen, onConfirmCancel, onDismiss }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay-backdrop modal-high-zindex" onClick={onDismiss}>
      <div className="cancel-confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="cancel-dialog-header">
          <div className="warning-circle-icon">⚠️</div>
          <h3>Cancel Grievance Submission?</h3>
        </div>

        <div className="cancel-dialog-body">
          <p className="primary-confirm-msg">
            Are you sure you want to cancel the grievance form submission?
          </p>
          <p className="secondary-confirm-subtext">
            Any unsaved information you entered will be lost.
          </p>
        </div>

        <div className="cancel-dialog-footer">
          <button
            type="button"
            className="confirm-yes-btn"
            onClick={onConfirmCancel}
          >
            Yes, Cancel
          </button>
          <button
            type="button"
            className="confirm-no-btn"
            onClick={onDismiss}
          >
            No, Keep Editing
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelConfirmModal;
