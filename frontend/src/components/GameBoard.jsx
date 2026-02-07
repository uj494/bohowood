import { useEffect, useState } from "react";
import Keyboard from "./Keyboard";
import StatusBar from "./StatusBar";
import MovieDisplay from "./MovieDisplay";
import { useNavigate } from "react-router-dom";

const vowels = ["A","E","I","O","U"];

export default function GameBoard({
  movie,
  onWin,
  hideScore = false
}) {
  const [masked, setMasked] = useState("");
  const [guessed, setGuessed] = useState([]);
  const [lives, setLives] = useState(3);
  const [result, setResult] = useState(null); // "win" | "lose"
  const [correct, setCorrect] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    resetGame(movie);
  }, [movie]);

  function resetGame(title) {
    setGuessed([]);
    setCorrect([]);
    setLives(3);
    setMasked(maskMovie(title));
    //setResult(null);
  }

  function maskMovie(title) {
    return title
      .split("")
      .map(ch =>
        ch === " " || vowels.includes(ch) || !/[A-Z]/.test(ch)
          ? ch
          : "_"
      )
      .join("");
  }

  function handleGuess(letter) {
    if (guessed.includes(letter)) return;

    setGuessed(g => [...g, letter]);

    if (movie.includes(letter)) {
      setCorrect(prev => [...prev, letter]);

      const updated = movie
        .split("")
        .map((ch, i) => ch === letter ? letter : masked[i])
        .join("");

      setMasked(updated);

      if (!updated.includes("_")) {
        setResult("win");
        //onWin?.();
      }
    } else {
      setLives(l => l - 1);
    }
  }

  useEffect(() => {
    if (lives === 0) {
      setResult("lose");
      resetGame(movie);
    }
  }, [lives]);

  return (
    <>
      <StatusBar lives={lives} score={hideScore ? null : 0} />
      <MovieDisplay masked={masked} />
      <Keyboard guessed={guessed} correct={correct} onGuess={handleGuess} />
      {result && (
        <div className="result-overlay">
          <div className="result-card">
            <h2>{result === "win" ? "🎉 You Won!" : "❌ You Lost"}</h2>
            <p>
              {result === "win"
                ? "You guessed the movie correctly!"
                : "Better luck next time"}
            </p>

            {result === "win" && (
            <div style={{ marginTop: 12 }}>
              <button
                className="secondary-btn"
                onClick={() => {
                  const msg =
                    `🎬 I guessed the movie! Try this challenge 👉 ${window.location.href}`;
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(msg)}`
                  );
                }}
              >
                📲 Share on WhatsApp
              </button>
              <button
                className="primary-btn"
                onClick={() => navigate("/create")}
              >
                Create your own challenge
              </button>
            </div>
          )}
          {result === "lose" && (
            <button
              className="primary-btn"
              onClick={() => window.location.reload()}
            >
              Play Again
            </button>
          )}
          <button
            className="primary-btn"
            onClick={() => navigate("/")}
          >
            Guess Another Movie
          </button>
          </div>
        </div>
      )}

    </>
  );
}
