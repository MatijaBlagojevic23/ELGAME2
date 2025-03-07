import { supabase } from "@/utils/supabase";

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase.from("users").select("*").limit(5);
    
    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ users: data });
  } catch (err) {
    console.error("Unexpected Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
