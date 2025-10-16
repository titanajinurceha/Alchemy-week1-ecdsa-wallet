import React from "react";

function AlertModal({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="alert-overlay" onClick={onClose}>
      <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
        <div className="alert-message">{message}</div>
        <button className="alert-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default AlertModal;
