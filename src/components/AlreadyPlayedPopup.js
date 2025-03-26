import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

const AlreadyPlayedPopup = ({ userId, onClose }) => {
  const [targetPlayer, setTargetPlayer] = useState('');

  useEffect(() => {
    const fetchTargetPlayer = async () => {
      const { data, error } = await supabase
        .from('games')
        .select('player')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching target player:', error.message);
      } else {
        setTargetPlayer(data?.player || 'Unknown');
      }
    };

    fetchTargetPlayer();
  }, [userId]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white p-6 rounded-md shadow-lg text-center">
        <p className="text-lg font-bold mb-4">
          You have already played today. The target player was {targetPlayer}.
        </p>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-md shadow-md transition-transform hover:scale-105 hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AlreadyPlayedPopup;
