import { supabase } from "../../../utils/supabase";

export default async function handler(req, res) {
    if (req.method !== 'POST' && req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { userId, gameState } = req.body;

    if (req.method === 'POST') {
        if (!userId || !gameState) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            const { error } = await supabase
                .from('games')
                .upsert({
                    user_id: userId,
                    state: gameState,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: ['user_id']
                });

            if (error) {
                throw error;
            }

            return res.status(200).json({ message: 'Game state updated successfully' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    if (req.method === 'GET') {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'Missing userId' });
        }

        try {
            const { data, error } = await supabase
                .from('games')
                .select('state')
                .eq('user_id', userId)
                .single();

            if (error) {
                throw error;
            }

            return res.status(200).json(data);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}
