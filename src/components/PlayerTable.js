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
            {/* Header Row (PC Version) */}
            <div className="hidden sm:grid grid-cols-7 gap-1 font-bold text-center p-2 bg-gray-800 text-white rounded shadow-md text-[8px] sm:text-[9px] md:text-[11px]">
                <div className="min-w-0 px-1 py-1">Name</div>
                <div className="min-w-0 px-1 py-1">Team</div>
                <div className="min-w-0 px-1 py-1">Country</div>
                <div className="min-w-0 px-1 py-1">Position</div>
                <div className="min-w-[40px] py-1">Height</div>
                <div className="min-w-[40px] py-1">Age</div>
                <div className="min-w-[30px] py-1">#</div>
            </div>

            {/* Header Row (Mobile Version) */}
            <div className="sm:hidden grid grid-cols-6 gap-1 font-bold text-center p-2 bg-gray-800 text-white rounded shadow-md text-[8px]">
                <div className="min-w-0 px-1 py-1">Team</div>
                <div className="min-w-0 px-1 py-1">Country</div>
                <div className="min-w-0 px-1 py-1">Position</div>
                <div className="min-w-[40px] py-1">Height</div>
                <div className="min-w-[40px] py-1">Age</div>
                <div className="min-w-[30px] py-1">#</div>
            </div>


            {attempts.map((player, index) => (
                <motion.div
                    key={index}
                    className="mt-1 shadow-md rounded-lg bg-gray-100 border sm:p-0.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {/* Mobile (Phone) Version - Two-Line Stacked Layout - Refined */}
                    <div className="sm:hidden flex flex-col items-stretch text-center text-xs">
                        <div className={`font-semibold py-2 px-2 rounded-t-lg text-black bg-white overflow-hidden text-ellipsis whitespace-nowrap`}> {/* Name line - same style */}
                            {player.name}
                        </div>
                        <div className="flex justify-between **gap-0.5 px-2 py-1** bg-gray-200 rounded-b-lg"> {/* Parameter line - flex with justify-between and gap-0.5, padding adjusted */}
                            {/* Team Box - Logo instead of Text */}
                            <div className={`**border rounded bg-white border-gray-300 flex items-center justify-center w-[16.6%]** ${getBackgroundColor(player, target, "team")}`}> {/* Box styling, w-[16.6%] for equal width, bg-white */}
                                <img src={`/logo/${player.team}.png`} alt={player.countryClub} className="w-4 h-4 sm:w-5 sm:h-5" /> {/* Team Logo */}
                            </div>
                            {/* Country Box */}
                            <div className={`**border rounded bg-white border-gray-300 flex flex-col items-center justify-center w-[16.6%]** ${player.country === target.country ? 'bg-green-500 text-black' : 'bg-red-500 text-black'}`}> {/* Box styling, w-[16.6%], bg-white */}
                                <div className="**text-[0.6rem]**">{player.country}</div> {/* Smaller text for country */}
                            </div>
                            {/* Position Box */}
                            <div className={`**border rounded bg-white border-gray-300 flex flex-col items-center justify-center w-[16.6%]** ${player.position === target.position ? 'bg-green-500 text-black' : 'bg-red-500 text-black'}`}> {/* Box styling, w-[16.6%], bg-white */}
                                <div className="**text-[0.6rem]**">{player.position}</div> {/* Smaller text for position */}
                            </div>
                            {/* Height Box */}
                            <div className={`**border rounded bg-white border-gray-300 flex flex-col items-center justify-center w-[16.6%]** ${getBackgroundColor(player, target, "height")}`}> {/* Box styling, w-[16.6%], bg-white */}
                                <div className="**text-[0.6rem]**">{player.height}cm <span className="text-[0.5rem]">{getHint(player, target, "height")}</span></div> {/* Smaller text for height and hint */}
                            </div>
                            {/* Age Box */}
                            <div className={`**border rounded bg-white border-gray-300 flex flex-col items-center justify-center w-[16.6%]** ${getBackgroundColor(player, target, "age")}`}> {/* Box styling, w-[16.6%], bg-white */}
                                <div className="**text-[0.6rem]**">{player.age} <span className="text-[0.5rem]">{getHint(player, target, "age")}</span></div> {/* Smaller text for age and hint */}
                            </div>
                            {/* # Box */}
                            <div className={`**border rounded bg-white border-gray-300 flex flex-col items-center justify-center w-[16.6%]** ${getBackgroundColor(player, target, "number")}`}> {/* Box styling, rounded-tr-lg removed, w-[16.6%], bg-white */}
                                <div className="**text-[0.6rem]**">#{player.number} <span className="text-[0.5rem]">{getHint(player, target, "number")}</span></div> {/* Smaller text for number and hint */}
                            </div>
                        </div>
                    </div>

                    {/* PC (and Larger) Version - Table Row Layout */}
                    <div className="hidden sm:grid grid-cols-7 items-center text-center p-0.5 sm:p-1 border rounded-lg bg-gray-100 text-[0.65rem] xs:text-[0.75rem] sm:text-[0.85rem]">
                        {/* Name */}
                        <div className={`px-1 p-0.5 sm:p-1 border rounded-md ${player.name === target.name ? 'bg-green-500 text-black' : 'bg-red-500 text-black'} min-h-[35px] sm:min-h-[40px] flex items-center justify-center font-semibold overflow-hidden text-ellipsis whitespace-nowrap`}>
                            {player.name}
                        </div>
                        {/* Team */}
                        <div className={`px-1 p-0.5 sm:p-1 border rounded-md ${getBackgroundColor(player, target, "team")} min-h-[35px] sm:min-h-[40px] flex items-center justify-center`}>
                            <img src={`/logo/${player.team}.png`} alt={player.countryClub} className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        {/* Country */}
                        <div className={`px-1 p-0.5 sm:p-1 border rounded-md ${player.country === target.country ? 'bg-green-500 text-black' : 'bg-red-500 text-black'} min-h-[35px] sm:min-h-[40px] flex items-center justify-center text-ellipsis overflow-hidden`}>{player.country}</div>
                        {/* Position */}
                        <div className={`px-1 p-0.5 sm:p-1 border rounded-md ${player.position === target.position ? 'bg-green-500 text-black' : 'bg-red-500 text-black'} min-h-[35px] sm:min-h-[40px] flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap`}>{player.position}</div>
                        {/* Height */}
                        <div className={`p-0.5 sm:p-1 border rounded-md ${getBackgroundColor(player, target, "height")} min-h-[35px] sm:min-h-[40px] flex items-center justify-center font-semibold`}>{player.height} cm {getHint(player, target, "height")}</div>
                        {/* Age */}
                        <div className={`p-0.5 sm:p-1 border rounded-md ${getBackgroundColor(player, target, "age")} min-h-[35px] sm:min-h-[40px] flex items-center justify-center font-semibold`}>{player.age} {getHint(player, target, "age")}</div>
                        {/* Number */}
                        <div className={`p-0.5 sm:p-1 border rounded-md ${getBackgroundColor(player, target, "number")} min-h-[35px] sm:min-h-[40px] flex items-center justify-center font-semibold`}>#{player.number} {getHint(player, target, "number")}</div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
