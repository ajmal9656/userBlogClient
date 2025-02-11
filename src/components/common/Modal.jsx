import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // If modal is not open, return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-50 backdrop-blur-md z-50">
      <div className="bg-white rounded-lg p-6 shadow-lg w-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
