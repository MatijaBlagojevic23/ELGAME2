import { useState, useEffect } from "react";

const WelcomePopup = ({ onClose }) => {
  const calculateTimeRemaining = () => {
    const now = new Date();
    const nextMidnight = new Date(now);
    nextMidnight.setUTCHours(24, 0, 0, 0); // Set to next 00:00 UTC
    const timeRemaining = nextMidnight - now; // Time remaining in milliseconds
    return {
      hours: Math.floor((timeRemaining / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((timeRemaining / (1000 * 60)) % 60),
      seconds: Math.floor((timeRemaining / 1000) % 60),
    };
  };

  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome to ELGAME!</h2>
        <p className="mb-4">
          🎯 Guess the EuroLeague Player! <br />
          🏀 You have 10 attempts to find the correct player. <br />
          ⬆️⬇️ Arrows indicate whether a guessed attribute is higher or lower. <br />
          ✅ Green fields mean a perfect match. <br />
          🟡 Yellow fields indicate the attribute is close. <br />
          🟡 A yellow-filled team logo means the guessed player's team is from the same country as the target player's team. <br />
          🏆 Try to guess the player in as few attempts as possible!
        </p>
        <div className="my-6">
          <div className="text-4xl font-extrabold text-purple-800">New player release in:</div>
          <div className="text-6xl font-extrabold text-red-600">
            {`${timeRemaining.hours.toString().padStart(2, "0")}:${timeRemaining.minutes.toString().padStart(2, "0")}:${timeRemaining.seconds.toString().padStart(2, "0")}`}
          </div>
        </div>
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
