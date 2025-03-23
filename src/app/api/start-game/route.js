import { supabase } from "../../../utils/supabase";
import { loadPlayers } from "../../../components/PlayerData";

export async function POST(request) {
  const { userId } = await request.json();
  const players = await loadPlayers();

  const today = new Date();
  const dateString = `${today.getUTCDate()}.${today.getUTCMonth() + 1}.${today.getUTCFullYear()}`;

  let targetPlayer;

  if (userId) {
    const randomIndex = getRandomIndex(players, dateString);
    targetPlayer = players[randomIndex];

    const { data: gameData, error } = await supabase
      .from("games")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today.toISOString().slice(0, 10))
      .maybeSingle();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    } else if (gameData) {
      return new Response(JSON.stringify({ gameOver: true, targetPlayer, attempts: gameData.attempts }), { status: 200 });
    }
  } else {
    const randomIndex = Math.floor(Math.random() * players.length);
    targetPlayer = players[randomIndex];
  }

  return new Response(JSON.stringify({ gameOver: false, targetPlayer, players }), { status: 200 });
}

function getRandomIndex(data, dateString) {
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
}
