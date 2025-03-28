const nodemailer = require('nodemailer');

async function sendInvitationEmail() {
  const userEmail = process.env.USER_EMAIL;
  const leagueName = process.env.LEAGUE_NAME;
  const invitationCode = process.env.INVITATION_CODE;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'elgameguess@gmail.com',
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: 'elgameguess@gmail.com',
    to: userEmail,
    subject: 'Your League Invitation Code',
    text: `You have successfully created the league: ${leagueName}\n\nYour invitation code is: ${invitationCode}\n\nShare this code with your friends to invite them to join the league.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Invitation email sent successfully');
  } catch (error) {
    console.error('Error sending invitation email:', error);
  }
}

sendInvitationEmail();
