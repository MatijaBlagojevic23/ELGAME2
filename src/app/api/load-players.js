import { supabase } from "@/utils/supabase";

export default async function handler(req, res) {
  try {
    console.log("Fetching players from Supabase...");
    const { data: players, error } = await supabase
      .from("players")
      .select("*");

    if (error) {
      console.error("Error fetching players:", error.message);
      return res.status(500).json({ error: error.message });
    }

    console.log("Players fetched successfully:", players);
    res.status(200).json(players);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: error.message });
  }
}
