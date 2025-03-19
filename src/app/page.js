"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import "../styles/globals.css";
import { supabase } from "../utils/supabase";
import { loadPlayers } from "../components/PlayerData";
import PlayerInput from "../components/PlayerInput";
import PlayerTable from "../components/PlayerTable";
import WelcomePopup from "../components/WelcomePopUp";
import UserMenu from "../components/UserMenu";

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
  const [showPlayedPopup, setShowPlayedPopup] = useState(false);
  const [showLeaderboardPopup, setShowLeaderboardPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);

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
    const dateString = `${today.getUTCDate()}.${today.getUTCMonth() + 1}.${today.getUTCFullYear()}`;

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

  // Timer useEffect: start a 20-second countdown for every attempt except the first one
  useEffect(() => {
    // Only start timer if there is at least one attempt and game is not over
    if (attempts.length > 0 && !gameOver) {
      setTimeLeft(20);
      const interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            // Auto-submit the last attempted guess when time expires
            const lastAttempt = attempts[attempts.length - 1];
            if (lastAttempt) {
              checkGuess(lastAttempt.name);
            }
            return 20;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [attempts, gameOver]);

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
    if (attempts.length > 0 && !gameOver) {
      setShowLogoutPopup(true);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setUsername("");
    setGameOver(false);
    // Reset game state
    setPlayers([]);
    setTarget(null);
    setAttempts([]);
    setGuess("");
  };

  const confirmLogout = async () => {
    if (user) {
      await updateLeaderboard(user.id, attempts.length);
    }
    await supabase.auth.signOut();
    setUser(null);
    setUsername("");
    setGameOver(false);
    setShowLogoutPopup(false);
    // Reset game state
    setPlayers([]);
    setTarget(null);
    setAttempts([]);
    setGuess("");
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

  const handleLeaderboardClick = () => {
    if (user && attempts.length > 0 && !gameOver) {
      setShowLeaderboardPopup(true);
    } else {
      window.location.href = '/auth/leaderboard';
    }
  };

  const handleConfirmLeaderboard = async () => {
    if (user) {
      // Update attempts to 10 for registered users
      await updateLeaderboard(user.id, attempts.length);
    }
    window.location.href = '/auth/leaderboard';
  };

  return (
    <div className="relative flex flex-col items-center gap-4 p-4 bg-gray-50 min-h-screen">
      <div className="absolute top-4 right-4 flex flex-col-reverse sm:flex-row items-center gap-4">
        {!user && (
          <Link href="/auth/signin">
            <a className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:scale-105 transition-transform">
              Login
            </a>
          </Link>
        )}
        <UserMenu
          user={user}
          onLogout={handleLogout}
          onShowRules={() => setShowWelcomePopup(true)}
        />
      </div>

      <div className="absolute top-4 left-4">
        <button
          onClick={handleLeaderboardClick}
          className="bg-purple-500 text-white px-4 py-2 rounded-md shadow-md hover:scale-105 transition-transform"
        >
          Leaderboard
        </button>
      </div>

      {showWelcomePopup && <WelcomePopup onClose={handleCloseWelcomePopup} />}

      {showPopup && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <p className="text-lg font-bold mb-4">Great job! You guessed correctly!</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:scale-105 transition-transform mb-2"
            >
              Play Again
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-gray-500 text-white px-6 py-3 rounded-md shadow-md transition-transform hover:scale-105 hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showExceedPopup && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <p className="text-lg font-bold mb-4">Too many attempts! The target player was {target?.name}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-md hover:scale-105 transition-transform mb-2"
            >
              Play Again
            </button>
            <button
              onClick={() => setShowExceedPopup(false)}
              className="bg-gray-500 text-white px-6 py-3 rounded-md shadow-md transition-transform hover:scale-105 hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
  
      {showPlayedPopup && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <p className="text-lg font-bold mb-4">You have already played today. The correct player was {target?.name}</p>
            <button
              onClick={() => setShowPlayedPopup(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md transition-transform hover:scale-105 hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showLeaderboardPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <p className="text-lg font-bold mb-4">Are you sure you want to go to the leaderboard? You will lose your data.</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={handleConfirmLeaderboard}
                className="bg-red-500 text-white px-6 py-3 rounded-md hover:scale-105 transition-transform"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLeaderboardPopup(false)}
                className="bg-gray-500 text-white px-6 py-3 rounded-md shadow-md transition-transform hover:scale-105 hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-md shadow-lg text-center">
            <p className="text-lg font-bold mb-4">Are you sure you want to log out? You will lose your data.</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmLogout}
                className="bg-red-500 text-white px-6 py-3 rounded-md hover:scale-105 transition-transform"
              >
                Yes
              </button>
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="bg-gray-500 text-white px-6 py-3 rounded-md shadow-md transition-transform hover:scale-105 hover:bg-gray-600"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center mb-4">
        <img src="/images/logo.png" alt="ELGAME Logo" className="w-1/2 sm:w-[30%] lg:w-[25%] xl:w-[20%] max-w-[300px]" />
      </div>
      <h1 className="text-2xl font-bold text-center text-purple-800 mb-4">ELGAME - Euroleague Player Guessing Game</h1>

      {attempts.length > 0 && !gameOver && (
        <div className="mb-4 p-2 rounded-md bg-gradient-to-r from-yellow-200 to-yellow-100">
  <span className="text-xl font-bold text-red-600">
    Time Left: <span className="inline-block ml-1 text-2xl font-semibold">{timeLeft}</span> seconds
  </span>
</div>
      )}

      <PlayerInput
        guess={guess}
        setGuess={setGuess}
        checkGuess={checkGuess}
        players={players}
        gameOver={gameOver}
        attempts={attempts}
        target={target}
      />

      <div ref={attemptsRef} className="w-full overflow-x-auto max-h-64 mt-4">
        <PlayerTable attempts={attempts} target={target} />
      </div>
    </div>
  );
}
