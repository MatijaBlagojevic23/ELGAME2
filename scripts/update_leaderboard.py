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
        yesterday = today - timedelta(days=1)  # Correctly refers to the previous day

        # Find users who haven't played on 'yesterday'
        response = supabase.table('leaderboard').select('userid').execute()
        inactive_users = [user['userid'] for user in response.data if user['userid'] not in (
            user['userid'] for user in supabase.table('games').select('userid').eq('game_date', yesterday).execute().data)]

        if inactive_users:
            user_ids = inactive_users

            # Update leaderboard for inactive users
            supabase.table('leaderboard').update({
                'games_played': supabase.func('games_played + 1'),
                'total_attempts': supabase.func('total_attempts + 10')
            }).in_('userid', user_ids).execute()

            logging.info("Leaderboard updated successfully.")

    except Exception as e:
        logging.error(f"Error updating leaderboard: {e}")
        raise

if __name__ == "__main__":
    update_leaderboard()
