import React from 'react';

const GameOverPopup = ({ user, onReload, onClose }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-6 rounded-md shadow-lg text-center">
        <p className="text-lg font-bold mb-4">Great job! You guessed correctly!</p>
        {user ? (
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-3 rounded-md shadow-md transition-transform hover:scale-105 hover:bg-gray-600"
          >
            Close
          </button>
        ) : (
          <>
            <button
              onClick={onReload}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:scale-105 transition-transform mb-2"
            >
              Play Again
            </button>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-3 rounded-md shadow-md transition-transform hover:scale-105 hover:bg-gray-600"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GameOverPopup;
