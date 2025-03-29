import { supabase } from '../../../utils/supabase';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { user_email, user_id, league_name, invitation_code, league_id, username } = req.body;

    try {
      // Send Invitation Email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'elgameguess@gmail.com',
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: 'elgameguess@gmail.com',
        to: user_email,
        subject: 'Invitation to Join League',
        text: `You have been invited to join the league: ${league_name}. Use the invitation code: ${invitation_code}`,
      };

      await transporter.sendMail(mailOptions);
      console.log('Invitation email sent successfully');

      // Create League Table
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

      const { error: createTableError } = await supabase.from('leagues').rpc('execute_sql', {
        sql: createTableQuery + insertFirstPlayerQuery,
      });

      if (createTableError) {
        console.error('Error creating league table:', createTableError);
        throw new Error(`Error creating league table: ${createTableError.message}`);
      }

      res.status(200).json({ message: 'League created successfully' });
    } catch (error) {
      console.error('Error creating league and sending email:', error);
      res.status(500).json({ message: 'Error creating league and sending email', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
