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
        return player.team === target.team ? "bg-green-500" : "bg-yellow-400";
      }
      return "bg-red-500";
    }
    if (["age", "height", "number"].includes(key)) {
      const diff = Math.abs(player[key] - target[key]);
      if (diff === 0) return "bg-green-500";
      if (diff <= 2) return "bg-yellow-400";
      return "bg-red-500";
    }
    return player[key] === target[key] ? "bg-green-500" : "bg-red-500";
  };

  return (
    <div className="mt-4 w-full max-w-7xl mx-auto overflow-x-auto">
      {/* Header Row */}
      <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-gray-900 text-white text-sm font-semibold text-center p-3 rounded-md shadow-lg">
        <div>Name</div>
        <div>Team</div>
        <div>Country</div>
        <div>Position</div>
        <div>Height</div>
        <div>Age</div>
        <div>#</div>
      </div>

      <div className="lg:hidden grid grid-cols-6 bg-gray-900 text-white text-xs font-semibold text-center p-2 rounded-md shadow-md">
        <div>Team</div>
        <div>Country</div>
        <div>Position</div>
        <div>Height</div>
        <div>Age</div>
        <div>#</div>
      </div>

      {attempts.map((player, index) => (
        <motion.div
          key={index}
          className="mt-2 shadow-lg bg-gray-200 border border-gray-300 rounded-md overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Mobile View */}
          <div className="lg:hidden flex flex-col text-center">
            <div className={`font-semibold py-2 bg-gray-300 text-black`}>{player.name}</div>
            <div className="grid grid-cols-6 gap-0.5 p-2 bg-white">
              <div className={`border p-1 flex items-center justify-center ${getBackgroundColor(player, target, "team")}`}>
                <img src={`/logo/${player.team}.png`} alt={player.countryClub} className="w-5 h-5" />
              </div>
              <div className={`border p-1 ${player.country === target.country ? "bg-green-500" : "bg-red-500"}`}>{player.country}</div>
              <div className={`border p-1 ${player.position === target.position ? "bg-green-500" : "bg-red-500"}`}>{player.position}</div>
              <div className={`border p-1 ${getBackgroundColor(player, target, "height")}`}>{player.height}cm {getHint(player, target, "height")}</div>
              <div className={`border p-1 ${getBackgroundColor(player, target, "age")}`}>{player.age} {getHint(player, target, "age")}</div>
              <div className={`border p-1 ${getBackgroundColor(player, target, "number")}`}>#{player.number} {getHint(player, target, "number")}</div>
            </div>
          </div>

          {/* PC View */}
          <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr] text-center text-sm bg-white p-2 border border-gray-300 rounded-md shadow-md">
            <div className={`border p-2 font-semibold ${player.name === target.name ? 'bg-green-500' : 'bg-red-500'}`}>{player.name}</div>
            <div className={`border p-2 ${getBackgroundColor(player, target, "team")}`}>
              <img src={`/logo/${player.team}.png`} alt={player.countryClub} className="w-6 h-6" />
            </div>
            <div className={`border p-2 ${player.country === target.country ? 'bg-green-500' : 'bg-red-500'}`}>{player.country}</div>
            <div className={`border p-2 ${player.position === target.position ? 'bg-green-500' : 'bg-red-500'}`}>{player.position}</div>
            <div className={`border p-2 ${getBackgroundColor(player, target, "height")}`}>{player.height} cm {getHint(player, target, "height")}</div>
            <div className={`border p-2 ${getBackgroundColor(player, target, "age")}`}>{player.age} {getHint(player, target, "age")}</div>
            <div className={`border p-2 ${getBackgroundColor(player, target, "number")}`}>#{player.number} {getHint(player, target, "number")}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
