import { useRef, useEffect, useState } from "react";

const PlayerInput = ({
  guess,
  setGuess,
  checkGuess,
  players,
  gameOver,
  attempts,
  target,
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);

  useEffect(() => {
    if (guess.length >= 2) {
      const filteredPlayers = players.filter((player) =>
        player.name.toLowerCase().includes(guess.toLowerCase())
      );
      setSuggestions(filteredPlayers);
      setIsDropdownOpen(filteredPlayers.length > 0);
      setHighlightedIndex(-1);
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

  return (
    <div className="relative w-full flex flex-col items-center gap-2" ref={inputRef}>
      <div className="w-full flex items-center gap-2">
        <input
          type="text"
          value={
            gameOver
              ? attempts.some(
                  (attempt) =>
                    attempt.name.toLowerCase() === target?.name.toLowerCase()
                )
                ? `You guessed it in ${attempts.length} attempts!`
                : `You haven't guessed it! The correct player was ${target?.name || "unknown"}.`
              : guess
          }
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full p-2 border rounded-md"
          placeholder="Type player's name..."
          disabled={gameOver}
        />
        <button
  onClick={() => checkGuess()}
  disabled={gameOver}
  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-full shadow-md transition transform duration-300 hover:scale-105 hover:shadow-xl"
>
  Submit
</button>
<button
  onClick={() => window.location.reload()}
  className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-full shadow-md transition transform duration-300 hover:scale-105 hover:shadow-xl"
>
  Play Again
</button>

      </div>

      {isDropdownOpen && (
        <ul className="absolute w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto mt-10 z-50">
          {suggestions.map((player, index) => (
            <li
              key={player.name}
              className={`p-2 cursor-pointer hover:bg-gray-200 ${
                index === highlightedIndex ? "bg-gray-300" : ""
              }`}
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
