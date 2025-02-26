import { useState, useEffect } from "react";

const WelcomePopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center">
        <h2 className="text-xl font-bold mb-4">Welcome to ELGAME!</h2>
        <p className="mb-4">
          🎯 Guess the EuroLeague Player! <br />
    📝  Enter the name of a player to compare their attributes with the target player.<br/>
          🏀 You have 10 attempts to find the correct player. <br />
          ⬆️⬇️ Arrows indicate whether a guessed attribute is higher or lower. <br />
          ✅ Green fields mean a perfect match. <br />
          🟡 Yellow fields indicate the attribute is close. <br />
          🟡 A yellow-filled team logo means the guessed player's team is from the same country as the target player's team. <br />
          🏆 Try to guess the player in as few attempts as possible!
        </p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Got it!
        </button>
      </div>
    </div>
  );
  };
  

export default WelcomePopup;
