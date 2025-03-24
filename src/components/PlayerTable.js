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
      if (diff === 0) {
        if (player.team === target.team && player.number === target.number && player.name !== target.name) {
          return "bg-yellow-300";
        }
        return "bg-green-500";
      }
      if (diff <= 2) return "bg-yellow-300";
      return "bg-red-500";
    }
    return player[key] === target[key] ? "bg-green-500" : "bg-red-500";
  };

  return (
    <div className="mt-4 w-full max-w-7xl mx-auto overflow-x-auto">
      {/* PC Header Row */}
      <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr] gap-1 font-bold text-center p-3 bg-gray-900 text-white shadow-lg rounded-lg text-sm">
        <div>Name</div>
        <div>Team</div>
        <div>Country</div>
        <div>Position</div>
        <div>Height</div>
        <div>Age</div>
        <div>#</div>
      </div>

      {/* Mobile Header Row */}
      <div className="lg:hidden grid grid-cols-6 gap-1 font-bold text-center p-2 bg-gray-900 text-white shadow-lg rounded-lg text-xs">
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
          className="mt-2 shadow-lg bg-gray-100 border rounded-lg overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Mobile Version */}
          <div className="lg:hidden flex flex-col text-center border border-gray-300 rounded-lg overflow-hidden">
            <div className={`font-semibold py-2 px-3 text-sm ${player.name === target.name ? "bg-green-500 text-black" : "bg-gray-200 text-black"}`}>{player.name}</div>
            <div className="grid grid-cols-6 gap-1 p-2">
              {['team', 'country', 'position', 'height', 'age', 'number'].map((key) => (
                <div key={key} className={`border flex items-center justify-center p-2 rounded-md ${getBackgroundColor(player, target, key)}`}>
                  {key === "team" ? (
                    <img src={`/logo/${player.team}.png`} alt={player.countryClub} className="w-6 h-6 object-contain" />
                  ) : (
                    <span className="text-xs font-medium">{player[key]} {getHint(player, target, key)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* PC Version */}
          <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center text-center p-2 border bg-white shadow-md rounded-lg text-sm">
            <div className={`px-3 py-2 font-semibold border rounded-md ${player.name === target.name ? "bg-green-500 text-black" : "bg-gray-200 text-black"}`}>{player.name}</div>
            <div className={`px-3 py-2 border rounded-md ${getBackgroundColor(player, target, "team")}`}>
              <img src={`/logo/${player.team}.png`} alt={player.countryClub} className="w-6 h-6 object-contain" />
            </div>
            {['country', 'position', 'height', 'age', 'number'].map((key) => (
              <div key={key} className={`px-3 py-2 border rounded-md ${getBackgroundColor(player, target, key)}`}>
                <span className="font-medium">{player[key]} {getHint(player, target, key)}</span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
