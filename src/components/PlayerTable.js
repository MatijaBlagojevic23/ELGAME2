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
            {/* Header Row (PC Version - Hidden on Phones) */}
            <div className="hidden sm:grid grid-cols-7 gap-1 font-bold text-center p-2 bg-gray-800 text-white rounded shadow-md text-[8px] sm:text-[10px] md:text-[15px]"> {/* Hidden on small screens */}
                <div className="min-w-0 px-1 py-1">Name</div>
                <div className="min-w-0 px-1 py-1">Team</div>
                <div className="min-w-0 px-1 py-1">Country</div>
                <div className="min-w-0 px-1 py-1">Position</div>
                <div className="min-w-[30px] py-1">Height</div>
                <div className="min-w-[30px] py-1">Age</div>
                <div className="min-w-[20px] py-1">#</div>
            </div>

            {/* Header Row (Mobile Version - Shown only on Phones) */}
            <div className="sm:hidden grid grid-cols-6 gap-1 font-bold text-center p-2 bg-gray-800 text-white rounded shadow-md text-[8px]"> {/* Only shown on small screens, 6 columns */}
                <div className="min-w-0 px-1 py-1">Team</div>
                <div className="min-w-0 px-1 py-1">Country</div>
                <div className="min-w-0 px-1 py-1">Position</div>
                <div className="min-w-[30px] py-1">Height</div>
                <div className="min-w-[30px] py-1">Age</div>
                <div className="min-w-[20px] py-1">#</div>
            </div>


            {attempts.map((player, index) => (
                <motion.div
                    key={index}
                    className="mt-1 shadow-md rounded-lg bg-gray-100 border sm:p-0.5" // General container styling, removed p-0.5 from sm: onwards
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {/* Mobile (Phone) Version - Two-Line Stacked Layout */}
                    <div className="sm:hidden flex flex-col items-stretch text-center text-xs"> {/* Only shown on small screens */}
                        <div className={`**font-semibold py-1 px-2 rounded-t-lg text-black bg-white** overflow-hidden text-ellipsis whitespace-nowrap`}> {/* Name line: White background, no color styling, removed border-b */}
                            {player.name}
                        </div>
                        <div className="flex justify-around py-1 px-2 text-[0.6rem] rounded-b-lg bg-gray-200"> {/* Parameters line */}
                            <div className={`border-r pr-1 last:border-r-0 ${getBackgroundColor(player, target, "team")}`}>{player.team}</div>
                            <div className={`border-r pr-1 last:border-r-0 ${player.country === target.country ? 'bg-green-500 text-black' : 'bg-red-500 text-black'}`}>{player.country}</div>
                            <div className={`border-r pr-1 last:border-r-0 ${player.position === target.position ? 'bg-green-500 text-black' : 'bg-red-500 text-black'}`}>{player.position}</div>
                            <div className={`border-r pr-1 last:border-r-0 ${getBackgroundColor(player, target, "height")}`}>{player.height}cm {getHint(player, target, "height")}</div> {/* Added hint back to mobile layout parameters */}
                            <div className={`border-r pr-1 last:border-r-0 ${getBackgroundColor(player, target, "age")}`}>{player.age} {getHint(player, target, "age")}</div> {/* Added hint back to mobile layout parameters */}
                            <div className={`${getBackgroundColor(player, target, "number")}`}>#{player.number} {getHint(player, target, "number")}</div> {/* Added hint back to mobile layout parameters */}
                        </div>
                    </div>

                    {/* PC (and Larger) Version - Table Row Layout */}
                    <div className="hidden sm:grid grid-cols-7 items-center text-center p-0.5 sm:p-1 border rounded-lg bg-gray-100 **text-[0.6rem] xs:text-[0.7rem] sm:text-sm**"> {/* Hidden on small screens, shown on larger - Increased font sizes for PC */}
                        {/* Name */}
                        <div className={`px-0.5 p-0.5 sm:p-1 border rounded-md ${player.name === target.name ? 'bg-green-500 text-black' : 'bg-red-500 text-black'} min-h-[35px] sm:min-h-[40px] flex items-center justify-center font-semibold overflow-hidden text-ellipsis whitespace-nowrap`}>
                            {player.name}
                        </div>
                        {/* Team */}
                        <div className={`px-0.5 p-0.5 sm:p-1 border rounded-md ${getBackgroundColor(player, target, "team")} min-h-[35px] sm:min-h-[40px] flex items-center justify-center`}>
                            <img src={`/logo/${player.team}.png`} alt={player.countryClub} className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        {/* Country */}
                        <div className={`px-0.5 p-0.5 sm:p-1 border rounded-md ${player.country === target.country ? 'bg-green-500 text-black' : 'bg-red-500 text-black'} min-h-[35px] sm:min-h-[40px] flex items-center justify-center text-ellipsis overflow-hidden`}>{player.country}</div>
                        {/* Position */}
                        <div className={`px-0.5 p-0.5 sm:p-1 border rounded-md ${player.position === target.position ? 'bg-green-500 text-black' : 'bg-red-500 text-black'} min-h-[35px] sm:min-h-[40px] flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap`}>{player.position}</div>
                        {/* Height */}
                        <div className={`p-0.5 sm:p-1 border rounded-md ${getBackgroundColor(player, target, "height")} min-h-[35px] sm:min-h-[40px] flex items-center justify-center font-semibold`}>{player.height} cm {getHint(player, target, "height")}</div> {/* Added hint back to PC layout */}
                        {/* Age */}
                        <div className={`p-0.5 sm:p-1 border rounded-md ${getBackgroundColor(player, target, "age")} min-h-[35px] sm:min-h-[40px] flex items-center justify-center font-semibold`}>{player.age} {getHint(player, target, "age")}</div> {/* Added hint back to PC layout */}
                        {/* Number */}
                        <div className={`p-0.5 sm:p-1 border rounded-md ${getBackgroundColor(player, target, "number")} min-h-[35px] sm:min-h-[40px] flex items-center justify-center font-semibold`}>#{player.number} {getHint(player, target, "number")}</div> {/* Added hint back to PC layout */}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
