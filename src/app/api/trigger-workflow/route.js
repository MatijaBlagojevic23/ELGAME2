import { NextResponse } from 'next/server';

export async function POST(request) {
  const { user_email, user_id, league_name, invitation_code, league_id, username } = await request.json();

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
      return NextResponse.json({ message: 'GitHub Actions workflow dispatched successfully' });
    } else {
      const errorData = await response.json();
      console.error('Error triggering GitHub Actions workflow:', errorData.message);
      return NextResponse.json({ message: errorData.message }, { status: response.status });
    }
  } catch (error) {
    console.error('Network error:', error);
    return NextResponse.json({ message: 'Network error. Please try again.' }, { status: 500 });
  }
}
