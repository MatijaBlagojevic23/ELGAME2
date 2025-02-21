"use client";


import { useState, useEffect, useRef } from "react";
import { loadPlayers } from "../components/PlayerData"; // Adjust the path
import PlayerInput from "../components/PlayerInput"; // Adjust the path
import PlayerTable from "../components/PlayerTable"; // Adjust the path
import WelcomePopup from "../components/WelcomePopUp"; // Adjust the path


export default function ELGAME() {
  const [players, setPlayers] = useState([]);
  const [target, setTarget] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [guess, setGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showExceedPopup, setShowExceedPopup] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  const attemptsRef = useRef(null); // Ref for scrolling

  useEffect(() => {
    loadPlayers().then((data) => {
      setPlayers(data);
      setTarget(data[Math.floor(Math.random() * data.length)]);
    });

    // Show welcome popup only on the first visit
    const hasSeenPopup = localStorage.getItem("hasSeenPopup");
    if (!hasSeenPopup) {
      setShowWelcomePopup(true);
    }
  }, []);

  const handleCloseWelcomePopup = () => {
    localStorage.setItem("hasSeenPopup", "true");
    setShowWelcomePopup(false);
  };

  const checkGuess = (submittedGuess) => {
    if (gameOver) return;

    const guessToCheck = submittedGuess || guess;
    const player = players.find(
      (p) => p.name.toLowerCase() === guessToCheck.toLowerCase()
    );
    if (!player) {
      alert("Player not found! Check spelling.");
      return;
    }

    const newAttempts = [...attempts, player];
    setAttempts(newAttempts);

    if (player.name.toLowerCase() === target.name.toLowerCase()) {
      setShowPopup(true);
      setGameOver(true);
    } else if (newAttempts.length >= 10) {
      setShowExceedPopup(true);
      setGameOver(true);
    }

    setGuess("");

    // Scroll the attempts list to the latest entry
    setTimeout(() => {
      if (attemptsRef.current) {
        attemptsRef.current.scrollTop = attemptsRef.current.scrollHeight;
      }
    }, 100);
  };

  return (
    <div className="relative flex flex-col items-center gap-4 p-6">
      {/* Rules Button in Upper Right Corner */}
      <button
        onClick={() => setShowWelcomePopup(true)}
        className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-full shadow-md transition duration-300 hover:scale-105"
      >
        Rules
      </button>

      {/* Welcome Popup */}
      {showWelcomePopup && <WelcomePopup onClose={handleCloseWelcomePopup} />}

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="text-xl font-bold mb-4">
              Okay, great! You guessed it correctly!
            </p>
            <p className="mb-4">Do you want to play again?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 text-white px-5 py-2 rounded-full shadow-md transition duration-300 hover:scale-105 hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-full shadow-md transition duration-300 hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exceed Attempts Popup */}
      {showExceedPopup && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p className="text-xl font-bold mb-4">
              You have tried too many times! The target player was{" "}
              <span className="text-red-500 font-bold">{target.name}</span>
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowExceedPopup(false)}
                className="bg-gray-500 text-white px-5 py-2 rounded-full shadow-md transition duration-300 hover:scale-105 hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-full shadow-md transition duration-300 hover:scale-105"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Logo */}
      <div className="w-full flex justify-center mb-1">
        <img
          src="/images/logo.png"
          alt="EuroLeague Logo"
          className="w-[20%] max-w-[280px]"
        />
      </div>
      <h1 className="text-2xl font-bold text-center">
        ELGAME - Euroleague Player Guessing Game
      </h1>

      <PlayerInput
        guess={guess}
        setGuess={setGuess}
        checkGuess={checkGuess}
        players={players}
        gameOver={gameOver}
        attempts={attempts}
        target={target}
      />

      {/* Scrolling Attempts Table */}
      <div
        ref={attemptsRef}
        className="w-full overflow-y-auto max-h-64 mt-4"
      >
        <PlayerTable attempts={attempts} target={target} />
      </div>
    </div>
  );
}
