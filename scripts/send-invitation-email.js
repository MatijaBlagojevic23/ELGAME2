const nodemailer = require('nodemailer');

async function sendInvitationEmail() {
  const user_email = process.env.USER_EMAIL;
  const league_name = process.env.LEAGUE_NAME;
  const invitation_code = process.env.INVITATION_CODE;

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

  try {
    await transporter.sendMail(mailOptions);
    console.log('Invitation email sent successfully');
  } catch (error) {
    console.error('Error sending invitation email:', error);
    process.exit(1);
  }
}

sendInvitationEmail();
