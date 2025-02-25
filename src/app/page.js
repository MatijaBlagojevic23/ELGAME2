"use client";

import "../styles/globals.css"; 

import { useState, useEffect, useRef } from "react";
import Link from "next/link"; // Import Link for navigation
import { signIn, useSession } from "next-auth/react"; // Import NextAuth
import { loadPlayers } from "../components/PlayerData";
import PlayerInput from "../components/PlayerInput";
import PlayerTable from "../components/PlayerTable";
import WelcomePopup from "../components/WelcomePopUp";

export default function ELGAME() {
  const { data: session } = useSession(); // Check authentication status
  const [players, setPlayers] = useState([]);
  const [target, setTarget] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [guess, setGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showExceedPopup, setShowExceedPopup] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  
  const attemptsRef = useRef(null);

  useEffect(() => {
    loadPlayers().then((data) => {
      setPlayers(data);
      setTarget(data[Math.floor(Math.random() * data.length)]);
    });

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

    setTimeout(() => {
      if (attemptsRef.current) {
        attemptsRef.current.scrollTop = attemptsRef.current.scrollHeight;
      }
    }, 100);
  };

  return (
    <div className="relative flex flex-col items-center gap-2 p-2 sm:p-4">
      {/* Top-Right Buttons */}
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => setShowWelcomePopup(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-md hover:scale-105"
        >
          Rules
        </button>
        {session ? (
          <p className="bg-gray-700 text-white px-3 py-2 rounded-full">{session.user.email}</p>
        ) : (
          <Link href="/auth/signin" className="bg-green-500 text-white px-3 py-2 rounded-full shadow-md hover:scale-105">
            Login
          </Link>
        )}
      </div>

      {/* Welcome Popup */}
      {showWelcomePopup && <WelcomePopup onClose={handleCloseWelcomePopup} />}

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50 p-2">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <p className="text-base font-bold mb-2">Great job! You guessed correctly!</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:scale-105"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Exceed Attempts Popup */}
      {showExceedPopup && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50 p-2">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <p className="text-base font-bold mb-2">Too many attempts! The target player was {target?.name}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-full hover:scale-105"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Top Logo */}
      <div className="w-full flex justify-center mb-2">
        <img src="/images/logo.png" alt="EuroLeague Logo" className="w-1/2 sm:w-[20%] max-w-[180px]" />
      </div>
      <h1 className="text-lg font-bold text-center">ELGAME - Euroleague Player Guessing Game</h1>

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
      <div ref={attemptsRef} className="w-full overflow-x-auto max-h-64 mt-2">
        <PlayerTable attempts={attempts} target={target} />
      </div>
    </div>
  );
}
