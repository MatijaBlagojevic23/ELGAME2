"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "../utils/supabase";
import PlayerInput from "./PlayerInput";
import PlayerTable from "./PlayerTable";
import WelcomePopup from "./WelcomePopUp";
import UserMenu from "./UserMenu";

export default function ELGAME({ session, players, target }) {
  const [user, setUser] = useState(session?.user || null);
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
    if (session) {
      setUser(session.user);
    }
  }, [session]);

  useEffect(() => {
    if (attempts.length > 0 && !gameOver) {
      setTimeLeft(20);
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
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

    if (!user) {
      console.error("User is not defined");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/api/check-guess`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guess: guessToCheck,
          userId: user.id,
          dateString: new Date().toISOString().slice(0, 10),
        }),
      });

      const data = await res.json();

      if (res.status === 404) {
        alert("Player not found! Check spelling.");
        return;
      }

      const newAttempts = [...attempts, data.player];
      setAttempts(newAttempts);

      if (data.success) {
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
    } catch (error) {
      console.error("Error checking guess:", error);
    }
  };

  const handleLogout = async () => {
    if (attempts.length > 0 && !gameOver) {
      setShowLogoutPopup(true);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setGameOver(false);
    setAttempts([]);
    setGuess("");
  };

  const confirmLogout = async () => {
    if (user) {
      await updateLeaderboard(user.id, 10);
    }
    await supabase.auth.signOut();
    setUser(null);
    setGameOver(false);
    setShowLogoutPopup(false);
    setAttempts([]);
    setGuess("");
  };

  const updateLeaderboard = async (userId, attempts) => {
    try {
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

      const today = new Date().toISOString().slice(0, 10);

      const { data: existingGame, error: fetchError } = await supabase
        .from("games")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking existing game play:", fetchError.message);
      } else if (existingGame) {
        const { error: updateError } = await supabase
          .from("games")
          .update({ date: today, attempts })
          .eq("id", existingGame.id);

        if (updateError) {
          console.error("Error updating game play:", updateError.message);
        }
      } else {
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
    } catch (error) {
      console.error("Error updating leaderboard:", error);
    }
  };

  const handleLeaderboardClick = () => {
    if (user && attempts.length > 0 && !gameOver) {
      setShowLeaderboardPopup(true);
    } else {
      window.location.href = "/auth/leaderboard";
    }
  };

  const handleConfirmLeaderboard = async () => {
    if (user) {
      await updateLeaderboard(user.id, 10);
    }
    window.location.href = "/auth/leaderboard";
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
