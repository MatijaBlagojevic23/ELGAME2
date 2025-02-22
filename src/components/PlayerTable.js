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
    if (["height", "age"].includes(key)) {
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
      {/* Header Row */}
      <div className="grid grid-cols-7 gap-1 font-bold text-center p-1 bg-gray-800 text-white rounded-lg shadow-md text-[8px] sm:text-xs md:text-sm">
        <div className="min-w-[60px]">Name</div>
        <div className="min-w-[60px]">Team</div>
        <div className="min-w-[60px]">Country</div>
        <div className="min-w-[60px]">Position</div>
        <div className="min-w-[60px]">Height</div>
        <div className="min-w-[60px]">Age</div>
        <div className="min-w-[40px]">#</div>
      </div>
      {attempts.map((player, index) => (
        <motion.div
          key={index}
          className="grid grid-cols-7 gap-1 items-center text-center p-1 border rounded-lg bg-gray-100 mt-1 shadow-md text-[8px] sm:text-xs md:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Name */}
          <div className={`p-1 border rounded-md ${player.name === target.name ? 'bg-green-500 text-black' : 'bg-red-500 text-black'} flex items-center justify-center font-semibold`}>
            {player.name}
          </div>

          {/* Team */}
          <div className={`p-1 border rounded-md ${getBackgroundColor(player, target, "team")} flex items-center justify-center`}>
            <img src={`/logo/${player.team}.png`} alt={player.countryClub} className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* Country */}
          <div className={`p-1 border rounded-md ${player.country === target.country ? 'bg-green-500 text-black' : 'bg-red-500 text-black'} flex items-center justify-center`}>
            {player.country}
          </div>

          {/* Position */}
          <div className={`p-1 border rounded-md ${player.position === target.position ? 'bg-green-500 text-black' : 'bg-red-500 text-black'} flex items-center justify-center`}>
            {player.position}
          </div>

          {/* Height */}
          <div className={`p-1 border rounded-md ${getBackgroundColor(player, target, "height")} flex items-center justify-center font-semibold`}>
            {player.height} cm {getHint(player, target, "height")}
          </div>

          {/* Age */}
          <div className={`p-1 border rounded-md ${getBackgroundColor(player, target, "age")} flex items-center justify-center font-semibold`}>
            {player.age} {getHint(player, target, "age")}
          </div>

          {/* Number */}
          <div className={`p-1 border rounded-md ${getBackgroundColor(player, target, "number")} flex items-center justify-center font-semibold`}>
            #{player.number} {getHint(player, target, "number")}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
