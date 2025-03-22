import { supabase } from "@/utils/supabase";

export default async function handler(req, res) {
  const { userId, attempts } = req.body;

  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("username")
      .eq("user_id", userId)
      .maybeSingle();

    if (userError || !userData) {
      return res.status(500).json({ error: userError?.message || "User not found" });
    }

    const username = userData.username || "Unknown";

    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: error.message });
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
        return res.status(500).json({ error: updateError.message });
      }
    } else {
      const { error: insertError } = await supabase.from("leaderboard").insert([{
        user_id: userId,
        username: username,
        total_attempts: attempts,
        games_played: 1,
      }]);

      if (insertError) {
        return res.status(500).json({ error: insertError.message });
      }
    }

    const today = new Date().toISOString().slice(0, 10);

    const { data: existingGame, error: fetchError } = await supabase
      .from("games")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    } else if (existingGame) {
      const { error: updateError } = await supabase
        .from("games")
        .update({ date: today, attempts })
        .eq("id", existingGame.id);

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
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
        return res.status(500).json({ error: insertError.message });
      }
    }

    res.status(200).json({ message: "Leaderboard updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
