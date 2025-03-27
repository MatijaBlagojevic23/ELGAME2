import React from 'react';

const WarningPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-lg text-center">
        <p className="text-lg font-bold mb-4">Important Information</p>
        <p className="mb-4">Please be aware that every refresh, closing the tab, or changing the tab will cause you to lose your progress. You will earn the maximum 10 points as if you haven't played today.</p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:scale-105 transition-transform"
        >
          Understand
        </button>
      </div>
    </div>
  );
};

export default WarningPopup;
