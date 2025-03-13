import os
import psycopg2
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)

def update_leaderboard():
    """Checks for users who haven't played yesterday and updates their leaderboard stats."""
    DATABASE_URL = os.getenv("DATABASE_URL")

    if not DATABASE_URL:
        raise ValueError("DATABASE_URL is not set")

    logging.info(f"DATABASE_URL: {DATABASE_URL}")

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        today = datetime.utcnow().date()
        yesterday = today - timedelta(days=1)  # Correctly refers to the previous day

        # Find users who haven't played on 'yesterday'
        cur.execute("""
            SELECT DISTINCT userid FROM leaderboard
            WHERE userid NOT IN (
                SELECT userid FROM games WHERE game_date = %s
            )
        """, (yesterday,))  # Use 'yesterday' instead of 'today'

        inactive_users = cur.fetchall()

        if inactive_users:
            user_ids = tuple(u[0] for u in inactive_users)

            cur.execute("""
                UPDATE leaderboard
                SET games_played = games_played + 1,
                    total_attempts = total_attempts + 10
                WHERE userid IN %s
            """, (user_ids,))

            conn.commit()

        cur.close()
        conn.close()
        logging.info("Leaderboard updated successfully.")

    except Exception as e:
        logging.error(f"Error updating leaderboard: {e}")
        raise

if __name__ == "__main__":
    update_leaderboard()
