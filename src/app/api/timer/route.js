import { supabase } from "../../../utils/supabase";

export async function POST(request) {
  const { userId, attempts } = await request.json();
  
  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), { status: 400 });
  }

  if (attempts.length > 0) {
    const lastAttempt = attempts[attempts.length - 1];
    const timeLeft = 20; // Reset timer to 20 seconds

    // Simulate server-side processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check guess logic (you can refine this based on actual game rules)
    const isCorrect = lastAttempt.name === "targetPlayerName"; // Replace with actual target player check

    if (isCorrect) {
      return new Response(JSON.stringify({ timeLeft: 20, gameOver: true, correct: true }), { status: 200 });
    } else if (attempts.length >= 10) {
      return new Response(JSON.stringify({ timeLeft: 20, gameOver: true, correct: false }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ timeLeft: 20, gameOver: false }), { status: 200 });
    }
  }

  return new Response(JSON.stringify({ timeLeft: 20, gameOver: false }), { status: 200 });
}
