"use client";

import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      let { data, error } = await supabase
        .from("leaderboard")
        .select("username, total_attempts, games_played, average_attempts")
        .order("average_attempts", { ascending: true });

      if (error) {
        console.error("Error fetching leaderboard:", error.message);
      } else {
        setLeaderboard(data);
      }
    };

    fetchLeaderboard();

    // Enable real-time updates
    const leaderboardSubscription = supabase
      .channel("leaderboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "leaderboard" }, fetchLeaderboard)
      .subscribe();

    return () => {
      supabase.removeChannel(leaderboardSubscription); // Cleanup
    };
  }, []);

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Leaderboard</h1>
      <div className="overflow-y-auto max-h-80 w-full">
        <table className="w-full max-w-lg bg-white shadow-md rounded-lg">
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
    </div>
  );
}
