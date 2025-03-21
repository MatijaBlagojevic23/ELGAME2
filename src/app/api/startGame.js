import { supabase } from "../../../utils/supabase";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { userId, gameState } = req.body;

    if (!userId || !gameState) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const { error } = await supabase
            .from('games')
            .upsert({
                user_id: userId,
                state: gameState,
                start_time: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, {
                onConflict: ['user_id']
            });

        if (error) {
            throw error;
        }

        return res.status(200).json({ message: 'Game started successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
