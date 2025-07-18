import React from "react";

const Modal = ({ open, onClose, title, children, wide = false }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center p-4">
      {/* Overlay click closes modal */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-label="Close modal"
        tabIndex={-1}
      />
      <div
        className={`relative bg-white rounded-lg shadow-2xl p-6 max-h-[90vh] overflow-y-auto ${
          wide ? "max-w-2xl w-full" : "max-w-md w-full"
        }`}
        role="dialog"
        tabIndex={0}
      >
        {/* Title & close */}
        <div className="flex items-center justify-between mb-4">
          {title ? <h2 className="text-lg font-bold">{title}</h2> : <div />}
          <button
            className="text-2xl text-gray-400 hover:text-gray-700 font-bold px-2"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
