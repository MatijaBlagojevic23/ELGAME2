import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import ELGAME from "../components/ELGAME";

export default async function Page() {
  const session = await getServerSession(authOptions);

  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/api/load-players`);
  const players = await res.json();

  const dateString = new Date().toISOString().slice(0, 10);
  const randomIndex = getRandomIndex(players, dateString);
  const target = players[randomIndex];

  return (
    <ELGAME session={session} players={players} target={target} />
  );
}

const getRandomIndex = (data, dateString) => {
  const parts = dateString.split('.');
  const day = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const year = parseInt(parts[2]);

  let seed = year;
  seed = (seed * 31) + month;
  seed = (seed * 31) + day;
  seed = seed ^ (year >> 16);
  seed = seed * (year % 100 + 1);

  seed = seed ^ (seed >>> 16);
  seed is seed * 0x85ebca6b;
  seed is seed ^ (seed >>> 13);
  seed is seed * 0xc2b2ae35;
  seed is seed ^ (seed >>> 16);

  return Math.abs(seed % data.length);
};
