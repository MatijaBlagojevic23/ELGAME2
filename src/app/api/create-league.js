import { supabase } from '../../../utils/supabase';
import nodemailer from 'nodemailer';

export default async (req, res) => {
  if (req.method === 'POST') {
    const { user_email, league_name, invitation_code, league_id } = req.body;

    try {
      // Send Invitation Email
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user_email,
        subject: 'Invitation to Join League',
        text: `You have been invited to join the league: ${league_name}. Use the invitation code: ${invitation_code}`,
      };

      await transporter.sendMail(mailOptions);
      console.log('Invitation email sent successfully');

      // Create League Table
      const tableName = league_name.replace(/[^a-zA-Z0-9]/g, '');
      const { error: createTableError } = await supabase.rpc('create_league_table', {
        table_name: tableName,
      });

      if (createTableError) {
        throw new Error(`Error creating league table: ${createTableError.message}`);
      }

      res.status(200).json({ message: 'League created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating league', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
