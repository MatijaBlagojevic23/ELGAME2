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
    if (key === "height" || key === "age") {
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
    <div className="mt-4 w-full max-w-7xl mx-auto overflow-x-auto">
      <div className="grid grid-cols-7 font-bold text-center p-3 bg-gray-800 text-white rounded-lg shadow-md">
        <div className="w-40">Name</div>
        <div className="w-32">Team</div>
        <div className="w-32">Country</div>
        <div className="w-48">Position</div>
        <div className="w-32">Height</div>
        <div className="w-32">Age</div>
        <div className="w-24">Number</div>
      </div>
      {attempts.map((player, index) => (
        <motion.div
          key={index}
          className="grid grid-cols-7 items-center text-center p-2 border rounded-lg bg-gray-100 mt-2 shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Name */}
          <div className={`p-3 border rounded-md ${player.name === target.name ? 'bg-green-500 text-black' : 'bg-red-500 text-black'} h-14 flex items-center justify-center text-lg font-semibold`}>{player.name}</div>
          
          {/* Team */}
          <div className={`p-3 border rounded-md ${getBackgroundColor(player, target, "team")} h-14 flex items-center justify-center`}>
            <img src={`/logo/${player.team}.png`} alt={player.countryClub} className="w-10 h-10" />
          </div>

          {/* Country */}
          <div className={`p-3 border rounded-md ${player.country === target.country ? 'bg-green-500 text-black' : 'bg-red-500 text-black'} h-14 flex items-center justify-center`}>{player.country}</div>
          
          {/* Position */}
          <div className={`p-3 border rounded-md ${player.position === target.position ? 'bg-green-500 text-black' : 'bg-red-500 text-black'} h-14 flex items-center justify-center`}>{player.position}</div>
          
          {/* Height */}
          <div className={`p-3 border rounded-md ${getBackgroundColor(player, target, "height")} h-14 flex items-center justify-center text-lg font-semibold`}>{player.height} cm {getHint(player, target, "height")}</div>
          
          {/* Age */}
          <div className={`p-3 border rounded-md ${getBackgroundColor(player, target, "age")} h-14 flex items-center justify-center text-lg font-semibold`}>{player.age} {getHint(player, target, "age")}</div>
          
          {/* Number */}
          <div className={`p-3 border rounded-md ${getBackgroundColor(player, target, "number")} h-14 flex items-center justify-center text-lg font-semibold`}>#{player.number} {getHint(player, target, "number")}</div>
        </motion.div>
      ))}
    </div>
  );
}

