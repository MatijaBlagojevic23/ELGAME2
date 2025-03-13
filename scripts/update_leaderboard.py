import os
from supabase import create_client, Client
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_API_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def update_leaderboard():
    """Checks for users who haven't played yesterday and updates their leaderboard stats."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase URL or API key is not set")

    logging.info("Supabase client initialized")

    try:
        today = datetime.utcnow().date()
        yesterday = today - timedelta(days=1)

        # Find users who haven't played on 'yesterday'
        response = supabase.table('leaderboard').select('user_id', 'games_played', 'total_attempts').execute()
        leaderboard_data = response.data

        inactive_users = [user for user in leaderboard_data if user['user_id'] not in (
            game['user_id'] for game in supabase.table('games').select('user_id').eq('game_date', yesterday).execute().data)]

        if inactive_users:
            for user in inactive_users:
                user_id = user['user_id']
                games_played = user['games_played'] + 1
                total_attempts = user['total_attempts'] + 10

                supabase.table('leaderboard').update({
                    'games_played': games_played,
                    'total_attempts': total_attempts
                }).eq('user_id', user_id).execute()

            logging.info("Leaderboard updated successfully.")

    except Exception as e:
        logging.error(f"Error updating leaderboard: {e}")
        raise

if __name__ == "__main__":
    update_leaderboard()
