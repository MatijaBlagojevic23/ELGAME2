import { supabase } from "../utils/supabase";
import { loadPlayers } from "../components/PlayerData";
import ELGAME from "../components/ELGAME";

export default async function Page() {
  const { data: { user } } = await supabase.auth.getSession();
  
  const initialUser = user || null;
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/api/start-game`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: initialUser?.id }),
  });

  const { targetPlayer, gameOver, attempts } = await res.json();

  const initialPlayers = await loadPlayers();

  return (
    <ELGAME 
      initialUser={initialUser}
      initialPlayers={initialPlayers}
      initialTarget={targetPlayer}
      initialAttempts={attempts || []}
      initialGameOver={gameOver || false}
    />
  );
}
