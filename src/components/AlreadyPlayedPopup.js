import React from 'react';

const AlreadyPlayedPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-6 rounded-md shadow-lg text-center">
        <p className="text-lg font-bold mb-4">You have already played today.</p>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md transition-transform hover:scale-105 hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AlreadyPlayedPopup;
