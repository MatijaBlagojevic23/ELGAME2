import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';

const AllTimeLeaderboard = () => {
  const [alltimeLeaderboard, setAlltimeLeaderboard] = useState([]);

  useEffect(() => {
    const fetchAllTimeLeaderboard = async () => {
      const { data, error } = await supabase
        .from('alltimeleaderboard')
        .select('user_id, username, games_played, total_attempts, average_attempts')
        .order('average_attempts', { ascending: true });

      if (error) {
        console.error('Error fetching all-time leaderboard:', error);
      } else {
        setAlltimeLeaderboard(data);
      }
    };

    fetchAllTimeLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-center text-purple-800 mb-4">All-Time Leaderboard</h1>
        <a href="/leaderboard" className="bg-purple-500 text-white px-4 py-2 rounded-md shadow-md hover:scale-105 transition-transform">
          Leaderboard
        </a>
      </div>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Games Played</th>
            <th className="py-2 px-4 border-b">Total Attempts</th>
            <th className="py-2 px-4 border-b">Average Attempts</th>
          </tr>
        </thead>
        <tbody>
          {alltimeLeaderboard.map((user) => (
            <tr key={user.user_id}>
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.games_played}</td>
              <td className="py-2 px-4 border-b">{user.total_attempts}</td>
              <td className="py-2 px-4 border-b">{user.average_attempts.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllTimeLeaderboard;
