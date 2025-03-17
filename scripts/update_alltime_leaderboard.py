import os
from supabase import create_client, Client
import logging

logging.basicConfig(level=logging.INFO)

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_API_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def update_alltime_leaderboard():
    """Updates the all-time leaderboard table with data from the leaderboard table."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase URL or API key is not set")

    logging.info("Supabase client initialized")

    try:
        # Fetch leaderboard data
        response = supabase.table('leaderboard').select('user_id', 'games_played', 'total_attempts').execute()
        leaderboard_data = response.data

        # Fetch all-time leaderboard data
        alltime_response = supabase.table('alltimeleaderboard').select('user_id', 'games_played', 'total_attempts').execute()
        alltime_data = alltime_response.data

        # Convert all-time leaderboard data to a dictionary for easy lookup
        alltime_dict = {user['user_id']: user for user in alltime_data}

        for user in leaderboard_data:
            user_id = user['user_id']
            games_played = user['games_played']
            total_attempts = user['total_attempts']

            if user_id in alltime_dict:
                # Update existing entry
                updated_games_played = alltime_dict[user_id]['games_played'] + games_played
                updated_total_attempts = alltime_dict[user_id]['total_attempts'] + total_attempts

                supabase.table('alltimeleaderboard').update({
                    'games_played': updated_games_played,
                    'total_attempts': updated_total_attempts
                }).eq('user_id', user_id).execute()
            else:
                # Insert new entry
                supabase.table('alltimeleaderboard').insert({
                    'user_id': user_id,
                    'games_played': games_played,
                    'total_attempts': total_attempts
                }).execute()

        logging.info("All-time leaderboard updated successfully.")

    except Exception as e:
        logging.error(f"Error updating all-time leaderboard: {e}")
        raise

if __name__ == "__main__":
    update_alltime_leaderboard()
