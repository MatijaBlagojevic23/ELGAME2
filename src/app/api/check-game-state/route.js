import { supabase } from "../../../utils/supabase";

export async function GET(request) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ message: "Missing userId" }), { status: 400 });
  }

  const { data: gameData, error } = await supabase
    .from("games")
    .select("*")
    .eq("user_id", userId)
    .eq("date", new Date().toISOString().slice(0, 10))
    .maybeSingle();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  if (!gameData) {
    return new Response(JSON.stringify({ gameOver: false, attempts: [] }), { status: 200 });
  }

  return new Response(JSON.stringify({ gameOver: gameData.attempts.length >= 10 || gameData.attempts.some(attempt => attempt.isCorrect), attempts: gameData.attempts }), { status: 200 });
}
