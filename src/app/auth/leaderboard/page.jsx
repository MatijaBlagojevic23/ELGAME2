"use client";
import "../../../styles/globals.css";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import Link from "next/link";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        let { data, error } = await supabase
          .from("leaderboard")
          .select("username, total_attempts, games_played, average_attempts");

        if (error) {
          console.error("Error fetching leaderboard:", error.message);
        } else {
          // Find the maximum games played
          const maxGamesPlayed = Math.max(...data.map(entry => entry.games_played));
          const threshold = maxGamesPlayed * 0.8;

          // Filter and sort players with at least 80% of the maximum games played
          const topPlayers = data
            .filter(entry => entry.games_played >= threshold)
            .sort((a, b) => a.average_attempts - b.average_attempts);

          // Filter and sort players with less than 80% of the maximum games played
          const otherPlayers = data
            .filter(entry => entry.games_played < threshold)
            .sort((a, b) => a.average_attempts - b.average_attempts);

          // Combine both lists
          const sortedLeaderboard = [...topPlayers, ...otherPlayers];
          setLeaderboard(sortedLeaderboard);
        }
      } catch (error) {
        console.error("Unexpected error:", error.message);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-indigo-600 text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold mt-10 mb-6">Leaderboard</h1>
      <div className="w-full max-w-4xl bg-white text-black shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-y-auto max-h-96">
          <table className="w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-6 py-3 text-left">Avg Attempts</th>
                <th className="px-6 py-3 text-left">Games Played</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leaderboard.map((entry, index) => (
                <tr key={index} className={`text-center ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}>
                  <td className="px-6 py-4">{index + 1}</td>
                  <td className="px-6 py-4">{entry.username.length > 12 ? `${entry.username.slice(0, 12)}...` : entry.username}</td>
                  <td className="px-6 py-4">{entry.average_attempts.toFixed(2)}</td>
                  <td className="px-6 py-4">{entry.games_played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8">
        <Link href="/">
          <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300">Back to Game</a>
        </Link>
      </div>
    </div>
  );
}
