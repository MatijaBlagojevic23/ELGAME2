
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
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
        if (error.message.includes("Unexpected token")) {
          console.error("Invalid JSON response:", error.message);
        } else {
          console.error("Error fetching leaderboard:", error.message);
        }
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
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <table className="w-full max-w-lg bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Avg Attempts</th>
            <th className="px-4 py-2">Games Played</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{entry.username}</td>
              <td className="px-4 py-2">{entry.average_attempts.toFixed(2)}</td>
              <td className="px-4 py-2">{entry.games_played}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
