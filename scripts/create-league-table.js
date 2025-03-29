const { createClient } = require('@supabase/supabase-js');

async function createLeagueTable() {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  const user_id = process.env.USER_ID;
  const league_name = process.env.LEAGUE_NAME;
  const username = process.env.USERNAME;

  const tableName = league_name.replace(/[^a-zA-Z0-9]/g, '');
  const createTableQuery = `
    CREATE TABLE public.${tableName} (
      user_id uuid NOT NULL,
      total_attempts integer NOT NULL DEFAULT 0,
      games_played integer NOT NULL DEFAULT 0,
      average_attempts numeric GENERATED ALWAYS AS (
        (
          (total_attempts)::numeric / (NULLIF(games_played, 0))::numeric
        )
      ) STORED NULL,
      username character varying(255) NOT NULL,
      CONSTRAINT ${tableName}_pkey PRIMARY KEY (user_id),
      CONSTRAINT ${tableName}_user_id_key UNIQUE (user_id),
      CONSTRAINT ${tableName}_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
    ) TABLESPACE pg_default;
  `;
  const insertFirstPlayerQuery = `
    INSERT INTO public.${tableName} (user_id, total_attempts, games_played, username)
    VALUES ('${user_id}', 0, 0, '${username}');
  `;

  try {
    const { error: createTableError } = await supabase.from('leagues').rpc('execute_sql', {
      sql: createTableQuery + insertFirstPlayerQuery,
    });

    if (createTableError) {
      console.error('Error creating league table:', createTableError);
      process.exit(1);
    }

    console.log('League table created and first player inserted successfully');
  } catch (error) {
    console.error('Error creating league table:', error);
    process.exit(1);
  }
}

createLeagueTable();
