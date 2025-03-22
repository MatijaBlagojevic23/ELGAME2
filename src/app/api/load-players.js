import { supabase } from "@/utils/supabase";

export default async function handler(req, res) {
  try {
    const { data: players, error } = await supabase
      .from("players")
      .select("*");

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json(players);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
