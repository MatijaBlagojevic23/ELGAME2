import { motion } from "framer-motion";

export default function PlayerTable({ attempts, target }) {
  const getHint = (player, target, key) => {
    if (player[key] === target[key]) return "✅";
    if (["height", "age", "number"].includes(key)) {
      return player[key] < target[key] ? "⬆️" : "⬇️";
    }
    return "❌";
  };

  const getBackgroundColor = (player, target, key) => {
    if (key === "team") {
      if (player.countryClub === target.countryClub) {
        return player.team === target.team ? "bg-green-500" : "bg-yellow-300";
      }
      return "bg-red-500";
    }
    if (key === "age") {
      const diff = Math.abs(player[key] - target[key]);
      if (diff === 0) return "bg-green-500";
      if (diff <= 1) return "bg-yellow-300";
    }
    if (key === "height") {
      const diff = Math.abs(player[key] - target[key]);
      if (diff === 0) return "bg-green-500";
      if (diff <= 3) return "bg-yellow-300";
    }
    if (key === "number") {
      const diff = Math.abs(player[key] - target[key]);
      if (diff === 0) return "bg-green-500";
      if (diff <= 2) return "bg-yellow-300";
      return "bg-red-500";
    }
    return player[key] === target[key] ? "bg-green-500" : "bg-red-500";
  };

  return (
    <div className="mt-2 w-full max-w-7xl mx-auto overflow-x-auto">
      {/* PC Header Row (7 columns including Name) */}
      <div className="hidden sm:grid grid-cols-7 gap-1 font-bold text-center p-2 bg-gray-800 text-white rounded shadow-md text-[10px] sm:text-[11px] md:text-[12px]">
        <div className="min-w-0 px-1 py-1">Name</div>
        <div className="min-w-0 px-1 py-1">Team</div>
        <div className="min-w-0 px-1 py-1">Country</div>
        <div className="min-w-0 px-1 py-1">Position</div>
        <div className="min-w-0 px-1 py-1">Height</div>
        <div className="min-w-0 px-1 py-1">Age</div>
        <div className="min-w-0 px-1 py-1">#</div>
      </div>

      {/* Mobile Header Row (6 columns, no Name) */}
      <div className="sm:hidden grid grid-cols-6 gap-1 font-bold text-center p-2 bg-gray-800 text-white rounded shadow-md text-[8px]">
        <div className="min-w-0 px-1 py-1">Team</div>
        <div className="min-w-0 px-1 py-1">Country</div>
        <div className="min-w-0 px-1 py-1">Position</div>
        <div className="min-w-0 px-1 py-1">Height</div>
        <div className="min-w-0 px-1 py-1">Age</div>
        <div className="min-w-0 px-1 py-1">#</div>
      </div>

      {attempts.map((player, index) => (
        <motion.div
          key={index}
          className="mt-1 shadow-md rounded-lg bg-gray-100 border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Mobile Version: Two-Line Stacked Layout */}
          <div className="sm:hidden flex flex-col text-center">
            {/* Top Line: Player Name with PC color logic */}
            <div
              className={`font-semibold py-1 px-2 rounded-t-lg overflow-hidden text-ellipsis whitespace-nowrap ${
                player.name === target.name
                  ? "bg-green-500 text-black"
                  : "bg-white text-black"
              }`}
            >
              {player.name}
            </div>
            {/* Bottom Line: Other Details in 6 equal boxes */}
            <div className="flex justify-between gap-0.5 px-2 py-1 rounded-b-lg">
              {/* Team Box */}
              <div
                className={`border rounded flex items-center justify-center w-[16.6%] ${getBackgroundColor(
                  player,
                  target,
                  "team"
                )}`}
              >
                <img
                  src={`/logo/${player.team}.png`}
                  alt={player.countryClub}
                  className="w-4 h-4"
                />
              </div>
              {/* Country Box */}
              <div
                className={`border rounded flex items-center justify-center w-[16.6%] ${
                  player.country === target.country
                    ? "bg-green-500 text-black"
                    : "bg-red-500 text-black"
                }`}
              >
                <div className="text-[0.6rem] truncate whitespace-nowrap">
                  {player.country}
                </div>
              </div>
              {/* Position Box */}
              <div
                className={`border rounded flex items-center justify-center w-[16.6%] ${
                  player.position === target.position
                    ? "bg-green-500 text-black"
                    : "bg-red-500 text-black"
                }`}
              >
                <div className="text-[0.6rem] truncate whitespace-nowrap">
                  {player.position}
                </div>
              </div>
              {/* Height Box */}
              <div
                className={`border rounded flex items-center justify-center w-[16.6%] ${getBackgroundColor(
                  player,
                  target,
                  "height"
                )}`}
              >
                <div className="text-[0.6rem] truncate whitespace-nowrap">
                  {player.height}cm{" "}
                  <span className="text-[0.5rem]">
                    {getHint(player, target, "height")}
                  </span>
                </div>
              </div>
              {/* Age Box */}
              <div
                className={`border rounded flex items-center justify-center w-[16.6%] ${getBackgroundColor(
                  player,
                  target,
                  "age"
                )}`}
              >
                <div className="text-[0.6rem] truncate whitespace-nowrap">
                  {player.age}{" "}
                  <span className="text-[0.5rem]">
                    {getHint(player, target, "age")}
                  </span>
                </div>
              </div>
              {/* Number Box */}
              <div
                className={`border rounded flex items-center justify-center w-[16.6%] ${getBackgroundColor(
                  player,
                  target,
                  "number"
                )}`}
              >
                <div className="text-[0.6rem] truncate whitespace-nowrap">
                  #{player.number}{" "}
                  <span className="text-[0.5rem]">
                    {getHint(player, target, "number")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PC (and Larger) Version: Table Row Layout */}
          <div className="hidden sm:grid grid-cols-7 items-center text-center p-1 border rounded-lg bg-gray-100 text-[0.75rem]">
            {/* Name */}
            <div
              className={`px-1 py-1 border rounded-md ${
                player.name === target.name
                  ? "bg-green-500 text-black"
                  : "bg-red-500 text-black"
              } flex items-center justify-center font-semibold overflow-hidden text-ellipsis whitespace-nowrap`}
            >
              {player.name}
            </div>
            {/* Team */}
            <div
              className={`px-1 py-1 border rounded-md ${getBackgroundColor(
                player,
                target,
                "team"
              )} flex items-center justify-center`}
            >
              <img
                src={`/logo/${player.team}.png`}
                alt={player.countryClub}
                className="w-5 h-5"
              />
            </div>
            {/* Country */}
            <div
              className={`px-1 py-1 border rounded-md ${
                player.country === target.country
                  ? "bg-green-500 text-black"
                  : "bg-red-500 text-black"
              } flex items-center justify-center overflow-hidden text-ellipsis`}
            >
              {player.country}
            </div>
            {/* Position */}
            <div
              className={`px-1 py-1 border rounded-md ${
                player.position === target.position
                  ? "bg-green-500 text-black"
                  : "bg-red-500 text-black"
              } flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap`}
            >
              {player.position}
            </div>
            {/* Height */}
            <div
              className={`px-1 py-1 border rounded-md ${getBackgroundColor(
                player,
                target,
                "height"
              )} flex items-center justify-center font-semibold`}
            >
              {player.height} cm {getHint(player, target, "height")}
            </div>
            {/* Age */}
            <div
              className={`px-1 py-1 border rounded-md ${getBackgroundColor(
                player,
                target,
                "age"
              )} flex items-center justify-center font-semibold`}
            >
              {player.age} {getHint(player, target, "age")}
            </div>
            {/* Number */}
            <div
              className={`px-1 py-1 border rounded-md ${getBackgroundColor(
                player,
                target,
                "number"
              )} flex items-center justify-center font-semibold`}
            >
              #{player.number} {getHint(player, target, "number")}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
