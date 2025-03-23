import { supabase } from "../../../../utils/supabase";
import { loadPlayers } from "../../../../components/PlayerData";

export async function POST(request) {
  const { userId, guess, targetPlayer } = await request.json();
  const players = await loadPlayers();

  const player = players.find(
    (p) => p.name.toLowerCase() === guess.toLowerCase()
  );

  if (!player) {
    return new Response(JSON.stringify({ message: "Player not found! Check spelling." }), { status: 404 });
  }

  const isCorrect = player.name.toLowerCase() === targetPlayer.name.toLowerCase();
  const attempt = { name: player.name, isCorrect };

  if (userId) {
    const { data: gameData, error } = await supabase
      .from("games")
      .select("*")
      .eq("user_id", userId)
      .eq("date", new Date().toISOString().slice(0, 10))
      .maybeSingle();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    const newAttempts = gameData ? [...gameData.attempts, attempt] : [attempt];

    if (gameData) {
      const { error: updateError } = await supabase
        .from("games")
        .update({ attempts: newAttempts })
        .eq("id", gameData.id);

      if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), { status: 500 });
      }
    } else {
      const { error: insertError } = await supabase.from("games").insert([
        {
          user_id: userId,
          date: new Date().toISOString().slice(0, 10),
          attempts: newAttempts,
        },
      ]);

      if (insertError) {
        return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
      }
    }

    return new Response(JSON.stringify({ attempts: newAttempts, gameOver: isCorrect || newAttempts.length >= 10 }), { status: 200 });
  }

  return new Response(JSON.stringify({ attempts: [attempt], gameOver: isCorrect }), { status: 200 });
}
