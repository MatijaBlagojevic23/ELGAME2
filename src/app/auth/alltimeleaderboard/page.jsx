"use client";
import "../../../styles/globals.css";
import { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import Link from "next/link";

export default function AllTimeLeaderboard() {
  const [alltimeLeaderboard, setAlltimeLeaderboard] = useState([]);

  useEffect(() => {
    const fetchAllTimeLeaderboard = async () => {
      try {
        let { data, error } = await supabase
          .from("alltimeleaderboard")
          .select("username, total_attempts, games_played, average_attempts");

        if (error) {
          console.error("Error fetching all-time leaderboard:", error.message);
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
          setAlltimeLeaderboard(sortedLeaderboard);
        }
      } catch (error) {
        console.error("Unexpected error:", error.message);
      }
    };

    fetchAllTimeLeaderboard();
  }, []);

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6 text-purple-800">All-Time Leaderboard</h1>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-full overflow-y-auto max-h-96">
          <table className="w-full table-auto divide-y divide-gray-200">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Avg Attempts</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Games Played</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alltimeLeaderboard.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.username.length > 12 ? `${entry.username.slice(0, 12)}...` : entry.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-500">{entry.average_attempts.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.games_played}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-8 flex space-x-4">
        <Link href="/">
          <a className="bg-gradient-to-r from-purple-500 to-orange-500 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-300 transform hover:scale-105 hover:shadow-lg">Back to Game</a>
        </Link>
        <Link href="/leaderboard">
          <a className="bg-gradient-to-r from-purple-500 to-orange-500 text-white font-semibold py-2 px-6 rounded-md shadow-md transition duration-300 transform hover:scale-105 hover:shadow-lg">Leaderboard</a>
        </Link>
      </div>
    </div>
  );
}
