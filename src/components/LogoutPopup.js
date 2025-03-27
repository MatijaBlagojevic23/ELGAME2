import React from 'react';

const LogoutPopup = ({ onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg text-center">
        <p className="text-lg font-bold mb-4">Are you sure you want to log out? You will lose your data.</p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:scale-105 transition-transform"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-3 rounded-md shadow-md transition-transform hover:scale-105 hover:bg-gray-600"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutPopup;
