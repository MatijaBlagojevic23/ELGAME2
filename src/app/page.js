"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import "../styles/globals.css";
import { supabase } from "../utils/supabase";
import { loadPlayers } from "../components/PlayerData";
import PlayerInput from "../components/PlayerInput";
import PlayerTable from "../components/PlayerTable";
import WelcomePopup from "../components/WelcomePopUp";
import Leaderboard from "../components/Leaderboard";

export default function ELGAME() {
  const [user, setUser] = useState(null);
  const [players, setPlayers] = useState([]);
  const [target, setTarget] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [guess, setGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showExceedPopup, setShowExceedPopup] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false); // State for Leaderboard popup

  const attemptsRef = useRef(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();
  }, []);

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="relative flex flex-col items-center gap-2 p-2 sm:p-4">
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={() => setShowWelcomePopup(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-md hover:scale-105"
        >
          Rules
        </button>
    
        {user ? (
          <>
            <p className="bg-gray-700 text-white px-3 py-2 rounded-full">{user.email}</p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-2 rounded-full shadow-md hover:scale-105"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth/signin" className="bg-green-500 text-white px-3 py-2 rounded-full shadow-md hover:scale-105">
            Login
          </Link>
        )}
      </div>

      {/* Leaderboard Button */}
      <div className="absolute top-2 left-2">
        <button
          onClick={() => setShowLeaderboard(true)}
          className="bg-blue-500 text-white px-3 py-2 rounded-full shadow-md hover:scale-105"
        >
          Leaderboard
        </button>
      </div>

      {showWelcomePopup && <WelcomePopup onClose={handleCloseWelcomePopup} />}

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
            <button
              onClick={() => setShowPopup(false)}
              className="bg-gray-500 text-white px-2 py-1 rounded-full shadow-md transition duration-300 hover:scale-105 hover:bg-gray-600 text-[8px] sm:text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
            <button
              onClick={() => setShowExceedPopup(false)}
              className="bg-gray-500 text-white px-2 py-1 rounded-full shadow-md transition duration-300 hover:scale-105 hover:bg-gray-600 text-[8px] sm:text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
            <button
              onClick={() => setShowLeaderboard(false)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              ✖
            </button>
            <Leaderboard />
          </div>
        </div>
      )}

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

      <div ref={attemptsRef} className="w-full overflow-x-auto max-h-64 mt-2">
        <PlayerTable attempts={attempts} target={target} />
      </div>
    </div>
  );
}
