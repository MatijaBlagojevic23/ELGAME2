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
  const [username, setUsername] = useState("");
  const [players, setPlayers] = useState([]);
  const [target, setTarget] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [guess, setGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showExceedPopup, setShowExceedPopup] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showPlayedPopup, setShowPlayedPopup] = useState(false);

  const attemptsRef = useRef(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("username")
          .eq("user_id", user.id)
          .single();

        if (error) {
          console.error("Error fetching username:", error.message);
        } else {
          setUsername(data?.username || "Unknown");
        }
      }
    };

    getUser();
  }, []);
  
  const getRandomIndex = (data, dateString) => {
  const parts = dateString.split('.');
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const year = parseInt(parts[2]);

  let seed = year;
  seed = (seed * 31) + month;
  seed = (seed * 31) + day;
  seed = seed ^ (year >> 16);
  seed = seed * (year % 100 + 1);

  seed = seed ^ (seed >>> 16);
  seed = seed * 0x85ebca6b;
  seed = seed ^ (seed >>> 13);
  seed = seed * 0xc2b2ae35;
  seed = seed ^ (seed >>> 16);

  return Math.abs(seed % data.length);
};

  const loadGame = async () => {
  const data = await loadPlayers();
  setPlayers(data);

  const today = new Date();
  const dateString = `${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}`;

  if (user) {
    // Use deterministic function for signed-in users
    const randomIndex = getRandomIndex(data, dateString);
    setTarget(data[randomIndex]);

    // Check if the user has already played today
    const { data: gameData, error } = await supabase
      .from("games")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today.toISOString().slice(0, 10))
      .maybeSingle();

    if (error) {
      console.error("Error checking game data:", error.message);
    } else if (gameData) {
      setGameOver(true);
      setShowPlayedPopup(true);
    }
  } else {
    // Use a completely random selection for unauthenticated users
    const randomIndex = Math.floor(Math.random() * data.length);
    setTarget(data[randomIndex]);
  }
};


  useEffect(() => {
    loadGame();

    const hasSeenPopup = localStorage.getItem("hasSeenPopup");
    if (!hasSeenPopup) {
      setShowWelcomePopup(true);
    }
  }, [user]);

  const handleCloseWelcomePopup = () => {
    localStorage.setItem("hasSeenPopup", "true");
    setShowWelcomePopup(false);
  };

  const checkGuess = async (submittedGuess) => {
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
      if (user) await updateLeaderboard(user.id, newAttempts.length);
    } else if (newAttempts.length >= 10) {
      setShowExceedPopup(true);
      setGameOver(true);
      if (user) await updateLeaderboard(user.id, newAttempts.length);
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
    setUsername("");
    setGameOver(false);
    //loadGame(); // Reload game for unauthenticated user
  };

  const updateLeaderboard = async (userId, attempts) => {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("username")
      .eq("user_id", userId)
      .maybeSingle();

    if (userError || !userData) {
      console.error("Error fetching username:", userError?.message || "User not found");
      return;
    }

    const username = userData.username || "Unknown";

    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching leaderboard data:", error.message);
      return;
    }

    if (data) {
      const { error: updateError } = await supabase
        .from("leaderboard")
        .update({
          total_attempts: data.total_attempts + attempts,
          games_played: data.games_played + 1,
        })
        .eq("user_id", userId);

      if (updateError) {
        console.error("Error updating leaderboard:", updateError.message);
      }
    } else {
      const { error: insertError } = await supabase.from("leaderboard").insert([{
        user_id: userId,
        username: username,
        total_attempts: attempts,
        games_played: 1,
      }]);

      if (insertError) {
        console.error("Error inserting into leaderboard:", insertError.message);
      }
    }

    // Log the game play for today to prevent multiple plays
    // Log the game play for today to prevent multiple plays
const today = new Date().toISOString().slice(0, 10);

// Check if the user already has an entry in the games table
const { data: existingGame, error: fetchError } = await supabase
  .from("games")
  .select("id")  // Fetch only the ID to minimize data transfer
  .eq("user_id", userId)
  .maybeSingle();

if (fetchError) {
  console.error("Error checking existing game play:", fetchError.message);
} else if (existingGame) {
  // If the user has played before, update the date and attempts
  const { error: updateError } = await supabase
    .from("games")
    .update({ date: today, attempts })
    .eq("id", existingGame.id);

  if (updateError) {
    console.error("Error updating game play:", updateError.message);
  }
} else {
  // If no existing entry, insert a new row
  const { error: insertError } = await supabase.from("games").insert([
    {
      user_id: userId,
      date: today,
      attempts: attempts,
    },
  ]);

  if (insertError) {
    console.error("Error inserting new game play:", insertError.message);
  }
}


    
  };

  return (
    <div className="relative flex flex-col items-center gap-2 p-2 sm:p-4">
      <div className="absolute top-2 right-2 flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => setShowWelcomePopup(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-full shadow-md hover:scale-105"
        >
          Rules
        </button>

        {user ? (
          <>
            <p className="bg-gray-700 text-white px-3 py-2 rounded-full text-center sm:text-left">
              <span className="block sm:hidden">
                {username.length > 8 ? `${username.slice(0, 8)}...` : username}
              </span>
              <span className="hidden sm:block">
                {username}
              </span>
            </p>
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
              className="bg-gray-500 text-white px-4 py-2 rounded-full shadow-md transition duration-300 hover:scale-105 hover:bg-gray-600"
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
              className="bg-gray-500 text-white px-4 py-2 rounded-full shadow-md transition duration-300 hover:scale-105 hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
  
      {showPlayedPopup && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50 p-2">
          <div className="bg-white p-4 rounded shadow-lg text-center">
            <p className="text-base font-bold mb-2">You have already played today. The correct player was {target?.name}</p>
            <button
              onClick={() => setShowPlayedPopup(false)}
              className="bg-gray-500 text-white px-2 py-1 rounded-full shadow-md transition duration-300 hover:scale-105 hover:bg-gray-600 text-[8px] sm:text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showLeaderboard && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div
            className="bg-white p-6 rounded-lg shadow-lg relative w-96 flex flex-col h-[70vh]"
            style={{ maxHeight: '70vh' }}
          >
            <Leaderboard />
            <div className="mt-auto flex justify-center">
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
