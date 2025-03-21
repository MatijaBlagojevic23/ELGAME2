import { supabase } from "../../../utils/supabase";

export default async function handler(req, res) {
    console.log("Request received:", req.method, req.body); // Log the request

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { userId, attempts } = req.body;

    if (!userId || !attempts) {
        console.log("Missing required fields:", { userId, attempts }); // Log missing fields
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("username")
            .eq("user_id", userId)
            .maybeSingle();

        if (userError || !userData) {
            console.error("Error fetching user:", userError?.message); // Log user fetch error
            throw new Error(userError?.message || "User not found");
        }

        const username = userData.username || "Unknown";
        console.log("User found:", username); // Log user information

        const { data, error } = await supabase
            .from("leaderboard")
            .select("*")
            .eq("user_id", userId)
            .maybeSingle();

        if (error) {
            console.error("Error fetching leaderboard:", error.message); // Log leaderboard fetch error
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
                console.error("Error updating leaderboard:", updateError.message); // Log leaderboard update error
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
                console.error("Error inserting into leaderboard:", insertError.message); // Log leaderboard insert error
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
            console.error("Error checking existing game play:", fetchError.message); // Log game fetch error
            throw new Error(fetchError.message);
        } else if (existingGame) {
            const { error: updateError } = await supabase
                .from("games")
                .update({ date: today, attempts })
                .eq("id", existingGame.id);

            if (updateError) {
                console.error("Error updating game play:", updateError.message); // Log game update error
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
                console.error("Error inserting new game play:", insertError.message); // Log game insert error
                throw new Error(insertError.message);
            }
        }

        console.log("Leaderboard updated successfully"); // Log success
        return res.status(200).json({ message: "Leaderboard updated successfully" });
    } catch (error) {
        console.error("Error updating leaderboard:", error); // Log errors
        return res.status(500).json({ message: error.message });
    }
}
