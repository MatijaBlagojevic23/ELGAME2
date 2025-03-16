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
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-y-auto max-h-96">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Avg Attempts</th>
                <th className="px-4 py-2">Games Played</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2 text-center">
                    {entry.username.length > 12 ? `${entry.username.slice(0, 12)}...` : entry.username}
                  </td>
                  <td className="px-4 py-2 text-center">{entry.average_attempts.toFixed(2)}</td>
                  <td className="px-4 py-2 text-center">{entry.games_played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8">
        <Link href="/">
          <a className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:scale-105">Back to Game</a>
        </Link>
      </div>
    </div>
  );
}
