"use client";

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
          .select("username, total_attempts, games_played, average_attempts")
          .order("average_attempts", { ascending: true });

        if (error) {
          console.error("Error fetching leaderboard:", error.message);
        } else {
          setLeaderboard(data);
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
      <table className="w-full max-w-3xl bg-white shadow-md rounded-lg overflow-hidden">
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
      <Link href="/">
        <a className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-full shadow-md hover:scale-105">Back to Game</a>
      </Link>
    </div>
  );
}
