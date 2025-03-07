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
  if (user) updateLeaderboard(user.id, newAttempts.length);
} else if (newAttempts.length >= 10) {
  setShowExceedPopup(true);
  setGameOver(true);
  if (user) updateLeaderboard(user.id, newAttempts.length);
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
 const updateLeaderboard = async (userId, attempts) => {
  console.log("Updating leaderboard for user:", userId);

  // Step 1: Fetch username from users table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("username")
    .eq("user_id", userId)  // Make sure to use `user_id` here as per your schema
    .single();

  if (userError) {
    console.error("Error fetching username:", userError.message);
    return;
  }

  const username = userData?.username || "Unknown"; // Default username if missing
  console.log("Fetched username:", username);

  // Step 2: Check if user exists in leaderboard
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .eq("user_id", userId)  // Make sure to use `user_id`, not `id`
    .single();

  if (error && error.code !== "PGRST001") {
    console.error("Error fetching leaderboard data:", error.message);
    return;
  }

  if (data) {
    console.log("User found in leaderboard, updating record...");
    // Step 3: Update existing record
    const { error: updateError } = await supabase
      .from("leaderboard")
      .update({
        total_attempts: data.total_attempts + attempts,
        games_played: data.games_played + 1,
        average_attempts: (data.total_attempts + attempts) / (data.games_played + 1), // Fix average calculation
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error updating leaderboard:", updateError.message);
    } else {
      console.log("Leaderboard updated successfully!");
    }
  } else {
    console.log("User not in leaderboard, inserting new record...");
    // Step 4: Insert new record
    const { error: insertError } = await supabase.from("leaderboard").insert([
      {
        user_id: userId,  // Ensure to use `user_id` here
        username: username,
        total_attempts: attempts,
        games_played: 1,
        average_attempts: attempts, // Initialize with the first attempt
      },
    ]);

    if (insertError) {
      console.error("Error inserting into leaderboard:", insertError.message);
    } else {
      console.log("New leaderboard entry added successfully!");
    }
  }
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
            <p className="bg-gray-700 text-white px-3 py-2 rounded-full">{user.username}</p>
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
    <div
      className="bg-white p-6 rounded-lg shadow-lg relative w-96 flex flex-col h-[70vh]" // Added flex and h-[70vh]
      style={{ maxHeight: '70vh' }} // Added maxHeight as fallback, if needed
    >
      <Leaderboard />
      <div className="mt-auto flex justify-center"> {/* Container for button to push it to bottom */}
        <button
          onClick={() => setShowLeaderboard(false)}
          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
        >
          Close
        </button>
      </div>
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
