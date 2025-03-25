"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import "../styles/globals.css";
import { supabase } from "../utils/supabase";
import { loadPlayers } from "../components/PlayerData";
import PlayerInput from "../components/PlayerInput";
import PlayerTable from "../components/PlayerTable";
import WelcomePopup from "../components/WelcomePopUp";
import WarningPopup from "../components/WarningPopup";
import GameOverPopup from "../components/GameOverPopup";
import ExceedAttemptsPopup from "../components/ExceedAttemptsPopup";
import AlreadyPlayedPopup from "../components/AlreadyPlayedPopup";
import LeaderboardPopup from "../components/LeaderboardPopup";
import LogoutPopup from "../components/LogoutPopup";
import ReloadPopup from "../components/ReloadPopup";
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
  const [showReloadPopup, setShowReloadPopup] = useState(false);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const [reloadAttempted, setReloadAttempted] = useState(false);

  const attemptsRef = useRef(null);
  const userMenuRef = useRef(null);

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
      } else {
        // Show warning popup for logged-in users who haven't played yet
        setShowWarningPopup(true);
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

  // Timer useEffect: start a 45-second countdown for every attempt except the first one
  useEffect(() => {
    // Only start timer if there is at least one attempt and game is not over
    if (attempts.length > 0 && !gameOver) {
      setTimeLeft(45);
      const interval = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(interval);
            // Auto-submit the last attempted guess when time expires
            const lastAttempt = attempts[attempts.length - 1];
            if (lastAttempt) {
              checkGuess(lastAttempt.name);
            }
            return 45;
          }
          return prevTime - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [attempts, gameOver]);

  // Effect for handling page reload
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (user && attempts.length > 0 && !gameOver) {
        event.preventDefault();
        event.returnValue = '';
        setReloadAttempted(true);
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user, attempts, gameOver]);

  // Effect for handling page visibility change and page hide
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (user && document.visibilityState === "hidden" && attempts.length > 0 && !gameOver) {
        window.location.reload();
      }
    };

    const handlePageHide = (event) => {
      if (user && attempts.length > 0 && !gameOver) {
        window.location.reload();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [user, attempts, gameOver]);

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

    if (newAttempts.length === 1 && user) {
      updateLeaderboard(user.id, 10);
    }

    if (player.name.toLowerCase() === target.name.toLowerCase()) {
      setShowPopup(true);
      setGameOver(true);
      if (user) refreshLeaderboard(user.id, newAttempts.length);
    } else if (newAttempts.length >= 10) {
      setShowExceedPopup(true);
      setGameOver(true);
      // No need to update the leaderboard here since it was already updated with max attempts
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
          total_attempts: data.total_attempts + 10,
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
        total_attempts: 10,
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
        .update({ date: today, attempts: 10 })
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
          attempts: 10,
        },
      ]);

      if (insertError) {
        console.error("Error inserting new game play:", insertError.message);
      }
    }
  };

  const refreshLeaderboard = async (userId, actualAttempts) => {
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
          total_attempts: data.total_attempts - 10 + actualAttempts,
        })
        .eq("user_id", userId);

      if (updateError) {
        console.error("Error refreshing leaderboard:", updateError.message);
      }
    }

    // Update the games table with the actual number of attempts
    const today = new Date().toISOString().slice(0, 10);

    const { data: existingGame, error: fetchError } = await supabase
      .from("games")
      .select("id")  // Fetch only the ID to minimize data transfer
      .eq("user_id", userId)
      .eq("date", today)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking existing game play:", fetchError.message);
    } else if (existingGame) {
      // If the user has played today, update the attempts
      const { error: updateError } = await supabase
        .from("games")
        .update({ attempts: actualAttempts })
        .eq("id", existingGame.id);

      if (updateError) {
        console.error("Error updating game play:", updateError.message);
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

  const handleConfirmLeaderboard = () => {
    window.location.href = '/auth/leaderboard';
  };

  const handleConfirmReload = () => {
    window.location.reload();
  };

  const handleCloseWarningPopup = () => {
    setShowWarningPopup(false);
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
        <div ref={userMenuRef}>
          <UserMenu
            user={user}
            onLogout={handleLogout}
            onShowRules={() => setShowWelcomePopup(true)}
            onShowPrivacy={() => {}}
            onShowTerms={() => {}}
            onShowContact={() => {}}
          />
        </div>
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
      {showWarningPopup && <WarningPopup onClose={handleCloseWarningPopup} />}
      {showPopup && <GameOverPopup user={user} onReload={handleConfirmReload} onClose={() => setShowPopup(false)} />}
      {showExceedPopup && <ExceedAttemptsPopup user={user} target={target} onReload={handleConfirmReload} onClose={() => setShowExceedPopup(false)} />}
      {showPlayedPopup && <AlreadyPlayedPopup onClose={() => setShowPlayedPopup(false)} />}
      {showLeaderboardPopup && <LeaderboardPopup onConfirm={handleConfirmLeaderboard} onClose={() => setShowLeaderboardPopup(false)} />}
      {showLogoutPopup && <LogoutPopup onConfirm={confirmLogout} onClose={() => setShowLogoutPopup(false)} />}
      {showReloadPopup && <ReloadPopup onConfirm={handleConfirmReload} onClose={() => setShowReloadPopup(false)} />}

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
