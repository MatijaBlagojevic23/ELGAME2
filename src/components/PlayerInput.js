import { useRef, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

const PlayerInput = ({
  guess,
  setGuess,
  checkGuess,
  players,
  gameOver,
  attempts,
  target,
  userId,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [playerFromDB, setPlayerFromDB] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchPlayerFromDB = async () => {
      if (userId) {
        const { data, error } = await supabase
          .from("games")
          .select("player, attempts")
          .eq("user_id", userId)
          .order("date", { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error("Error fetching player from DB:", error.message);
        } else {
          setPlayerFromDB(data?.player || "unknown");
        }
      }
    };

    fetchPlayerFromDB();
  }, [userId]);

  useEffect(() => {
    if (guess.length >= 2) {
      if (Array.isArray(players)) {
        const filteredPlayers = players.filter((player) =>
          player.name.toLowerCase().includes(guess.toLowerCase())
        );
        setSuggestions(filteredPlayers);
        setIsDropdownOpen(filteredPlayers.length > 0);
        setHighlightedIndex(-1);
      } else {
        console.error("Players is not an array:", players);
      }
    } else {
      setSuggestions([]);
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }
  }, [guess, players]);

  useEffect(() => {
    if (attempts.length > 0) {
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [attempts]);

  const handleChange = (e) => {
    setGuess(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (gameOver) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setHighlightedIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
        );
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (isDropdownOpen && suggestions.length > 0) {
        const selectedName =
          highlightedIndex >= 0 ? suggestions[highlightedIndex].name : suggestions[0].name;
        handleSelect(selectedName);
      } else {
        checkGuess();
      }
    }
  };

  const handleSelect = (name) => {
    setGuess(name);
    setIsDropdownOpen(false);
    checkGuess(name);
  };

  const renderInputValue = () => {
    if (gameOver) {
      if (userId) {
        if (attempts.some((attempt) => attempt.name.toLowerCase() === target?.name.toLowerCase())) {
          return `You guessed it in ${attempts.length} ${attempts.length === 1 ? "attempt" : "attempts"}! The player was ${playerFromDB}.`;
        } else {
          return `The correct player was ${target?.name || "unknown"}.`;
        }
      } else {
        if (attempts.some((attempt) => attempt.name.toLowerCase() === target?.name.toLowerCase())) {
          return `You guessed it in ${attempts.length} ${attempts.length === 1 ? "attempt" : "attempts"}.`;
        } else {
          return `The correct player was ${target?.name || "unknown"}.`;
        }
      }
    }
    return guess;
  };

  return (
    <div className="relative w-full flex flex-col items-center gap-2" ref={inputRef}>
      <div className="w-full flex items-center gap-2">
        <input
          type="text"
          value={renderInputValue()}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border rounded-md"
          placeholder="Type player's name..."
          disabled={gameOver}
        />
        <button
          onClick={() => checkGuess()}
          disabled={gameOver}
          className="bg-orange-600 text-white px-6 py-3 rounded-md shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl"
        >
          Submit
        </button>
        <button
          onClick={() => window.location.reload()}
          className="bg-green-600 text-white px-6 py-3 rounded-md shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-xl"
        >
          Play Again
        </button>
      </div>

      {isDropdownOpen && (
        <ul className="absolute w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto mt-12 z-50">
          {suggestions.map((player, index) => (
            <li
              key={player.name}
              className={`p-2 cursor-pointer hover:bg-gray-200 ${index === highlightedIndex ? "bg-gray-300" : ""}`}
              onClick={() => handleSelect(player.name)}
            >
              {player.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlayerInput;
