import { supabase } from "@/utils/supabase";

export default async function handler(req, res) {
  const { guess, userId, dateString } = req.body;

  try {
    const { data: players, error } = await supabase
      .from("players")
      .select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const player = players.find(
      (p) => p.name.toLowerCase() === guess.toLowerCase()
    );

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    const randomIndex = getRandomIndex(players, dateString);
    const target = players[randomIndex];

    if (player.name.toLowerCase() === target.name.toLowerCase()) {
      await updateLeaderboard(userId, 1); // Assuming 1 attempt for simplicity
      return res.status(200).json({ success: true, player: target });
    }

    res.status(200).json({ success: false, player: target });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

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

const updateLeaderboard = async (userId, attempts) => {
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("username")
    .eq("user_id", userId)
    .maybeSingle();

  if (userError || !userData) {
    throw new Error(userError?.message || "User not found");
  }

  const username = userData.username || "Unknown";

  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
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
      throw new Error(updateError.message);
    }
  } else {
    const { error: insertError } = await supabase.from("leaderboard").insert([{
      user_id: userId,
      username: username,
      total_attempts: attempts,
      games_played: 1,
    }]);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  const today = new Date().toISOString().slice(0, 10);

  const { data: existingGame, error: fetchError } = await supabase
    .from("games")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  } else if (existingGame) {
    const { error: updateError } = await supabase
      .from("games")
      .update({ date: today, attempts })
      .eq("id", existingGame.id);

    if (updateError) {
      throw new Error(updateError.message);
    }
  } else {
    const { error: insertError } = await supabase.from("games").insert([
      {
        user_id: userId,
        date: today,
        attempts: attempts,
      },
    ]);

    if (insertError) {
      throw new Error(insertError.message);
    }
  }
};
