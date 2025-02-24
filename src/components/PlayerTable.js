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
    if (key === "height") {
      const diff = Math.abs(player[key] - target[key]);
      if (diff === 0) return "bg-green-500";
      if (diff <= 3) return "bg-yellow-300";
    }
    if (key === "age") {
      const diff = Math.abs(player[key] - target[key]);
      if (diff === 0) return "bg-green-500";
      if (diff <= 1) return "bg-yellow-300";
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
      <div className="grid grid-cols-7 gap-0.5 font-bold text-center p-1 bg-gray-800 text-white rounded shadow-md text-[6px] sm:text-[8px]">
  <div className="min-w-[30px]">Name</div>
  <div className="min-w-[30px]">Team</div>
  <div className="min-w-[30px]">Country</div>
  <div className="min-w-[30px]">Position</div>
  <div className="min-w-[30px]">Height</div>
  <div className="min-w-[30px]">Age</div>
  <div className="min-w-[20px]">#</div>
</div>

      {attempts.map((player, index) => (
        <motion.div
          key={index}
          className="grid grid-cols-7 items-center text-center p-0.5 sm:p-1 border rounded-lg bg-gray-100 mt-1 shadow-md text-[0.7rem] sm:text-xs" // Reduced padding and text size even further
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Name */}
          <div className={`p-0.5 sm:p-1 border rounded-md ${player.name === target.name ? 'bg-green-500 text-black' : 'bg-red-500 text-black'} min-h-[35px] sm:min-h-[40px] flex items-center justify-center font-semibold`}>{player.name}</div> {/* Reduced padding and min-height */}

          {/* Team */}
          <div className={`p-0.5 sm:p-1 border rounded-md ${getBackgroundColor(player, target, "team")} min-h-[35px] sm:min-h-[40px] flex items-center justify-center`}> {/* Reduced padding and min-height */}
            <img src={`/logo/${player.team}.png`} alt={player.countryClub} className="w-5 h-5 sm:w-6 sm:h-6" /> {/* Further reduced image size */}
          </div>

          {/* Country */}
          <div className={`p-0.5 sm:p-1 border rounded-md ${player.country === target.country ? 'bg-green-500 text-black' : 'bg-red-500 text-black'} min-h-[35px] sm:min-h-[40px] flex items-center justify-center`}>{player.country}</div> {/* Reduced padding and min-height */}

          {/* Position */}
          <div className={`p-0.5 sm:p-1 border rounded-md ${player.position === target.position ? 'bg-green-500 text-black' : 'bg-red-500 text-black'} min-h-[35px] sm:min-h-[40px] flex items-center justify-center`}>{player.position}</div> {/* Reduced padding and min-height */}

          {/* Height */}
          <div className={`p-0.5 sm:p-1 border rounded-md ${getBackgroundColor(player, target, "height")} min-h-[35px] sm:min-h-[40px] flex items-center justify-center font-semibold`}>{player.height} cm {getHint(player, target, "height")}</div> {/* Reduced padding and min-height */}

          {/* Age */}
          <div className={`p-0.5 sm:p-1 border rounded-md ${getBackgroundColor(player, target, "age")} min-h-[35px] sm:min-h-[40px] flex items-center justify-center font-semibold`}>{player.age} {getHint(player, target, "age")}</div> {/* Reduced padding and min-height */}

          {/* Number */}
          <div className={`p-0.5 sm:p-1 border rounded-md ${getBackgroundColor(player, target, "number")} min-h-[35px] sm:min-h-[40px] flex items-center justify-center font-semibold`}>#{player.number} {getHint(player, target, "number")}</div> {/* Reduced padding and min-height */}
        </motion.div>
      ))}
    </div>
  );
}
