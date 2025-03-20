const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post('/api/leaderboard', async (req, res) => {
  const { userId, attempts } = req.body;

  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("username")
      .eq("user_id", userId)
      .maybeSingle();

    if (userError || !userData) {
      console.error("Error fetching username:", userError?.message || "User not found");
      return res.status(400).send({ message: 'User not found' });
    }

    const username = userData.username || "Unknown";

    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching leaderboard data:", error.message);
      return res.status(400).send({ message: 'Error fetching leaderboard data' });
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
        return res.status(400).send({ message: 'Error updating leaderboard' });
      } else {
        console.log('Leaderboard updated for user:', userId);
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
        return res.status(400).send({ message: 'Error inserting into leaderboard' });
      } else {
        console.log('New leaderboard entry created for user:', userId);
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
      return res.status(400).send({ message: 'Error checking existing game play' });
    } else if (existingGame) {
      // If the user has played before, update the date and attempts
      const { error: updateError } = await supabase
        .from("games")
        .update({ date: today, attempts })
        .eq("id", existingGame.id);

      if (updateError) {
        console.error("Error updating game play:", updateError.message);
        return res.status(400).send({ message: 'Error updating game play' });
      } else {
        console.log('Game play updated for user:', userId);
      }
    } else {
      // If no existing entry, insert a new row
      const { error: insertError } = await supabase.from("games").insert([
        {
          user_id: userId,
          date: today,
          attempts: attempts,
        },
      ]);

      if (insertError) {
        console.error("Error inserting new game play:", insertError.message);
        return res.status(400).send({ message: 'Error inserting new game play' });
      } else {
        console.log('New game play entry created for user:', userId);
      }
    }

    res.status(200).send({ message: 'Leaderboard updated successfully' });
  } catch (e) {
    console.error("Fetch error:", e);
    res.status(500).send({ message: 'Internal server error' });
  }
});

module.exports = app;
