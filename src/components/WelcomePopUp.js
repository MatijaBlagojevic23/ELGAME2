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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 overflow-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-auto my-auto max-h-[80vh] overflow-y-auto">
        <div className="p-8">
          <h2 className="text-3xl font-semibold text-center text-indigo-700 mb-6">
            Welcome to ELGAME!
          </h2>
          <div className="space-y-4 text-lg text-gray-700 mb-8">
            <p>🎯 Guess the EuroLeague Player!</p>
            <p>🏀 You have 10 attempts to find the correct player.</p>
            <p>⬆️⬇️ Arrows indicate whether a guessed attribute is higher or lower.</p>
            <p>✅ Green fields mean a perfect match.</p>
            <p>🟡 Yellow fields indicate the attribute is close.</p>
            <p>
              🟡 A yellow-filled team logo means the guessed player's team is from
              the same country as the target player's team.
            </p>
            <p>🏆 Try to guess the player in as few attempts as possible!</p>
            <p>🔓 You can play as many times as you want when logged out.</p>
            <p>🔒 When signed in, you can only play once a day and be added to the leaderboard.</p>
          </div>
          <div className="text-center mb-8">
            <div className="text-2xl font-bold text-gray-800 mb-2">
              New player release in:
            </div>
            <div className="flex justify-center space-x-4">
              <div className="bg-indigo-100 p-4 rounded-lg shadow">
                <div className="text-4xl font-extrabold text-indigo-700">
                  {timeRemaining.hours.toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-gray-600">Hours</div>
              </div>
              <div className="bg-indigo-100 p-4 rounded-lg shadow">
                <div className="text-4xl font-extrabold text-indigo-700">
                  {timeRemaining.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-gray-600">Minutes</div>
              </div>
              <div className="bg-indigo-100 p-4 rounded-lg shadow">
                <div className="text-4xl font-extrabold text-indigo-700">
                  {timeRemaining.seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-gray-600">Seconds</div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={onClose}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
