export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { user_email, user_id, league_name, invitation_code, league_id, username } = req.body;
    
    const inputs = {
      user_email,
      user_id,
      league_name,
      invitation_code,
      league_id,
      username,
    };

    // Log the inputs to the console
    console.log('Inputs for GitHub Actions workflow:', inputs);

    try {
      const response = await fetch(`https://api.github.com/repos/MatijaBlagojevic23/ELGAME2/actions/workflows/create-league.yml/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.TOKEN1}`,
          'Accept': 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          ref: 'darkmodetest',
          inputs: inputs,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response status text:', response.statusText);

      if (response.ok) {
        res.status(200).json({ message: 'GitHub Actions workflow dispatched successfully' });
      } else {
        const errorData = await response.json();
        console.error('Error triggering GitHub Actions workflow:', errorData.message);
        res.status(response.status).json({ message: errorData.message });
      }
    } catch (error) {
      console.error('Network error:', error);
      res.status(500).json({ message: 'Network error. Please try again.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
