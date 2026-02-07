import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import StatusBar from "../components/StatusBar";
import MovieDisplay from "../components/MovieDisplay";
import Keyboard from "../components/Keyboard";
import Actions from "../components/Actions";
import Sparkles from "../components/Sparkles";
import Confetti from "../components/Confetti";
import { getDeviceId } from "../utils/device";
import { useNavigate } from "react-router-dom";
import "../style.css";

const vowels = ["A", "E", "I", "O", "U"];
const API_BASE = "/api";

export default function App() {
  const [industry, setIndustry] = useState(() => {
    return localStorage.getItem("industry") || "bollywood";
  });
  
  const [movie, setMovie] = useState("");
  const [masked, setMasked] = useState("");
  const [guessed, setGuessed] = useState([]);
  const [lives, setLives] = useState(3);
  const [result, setResult] = useState(null); // "win" | "lose"
  const [score, setScore] = useState(0);
  const [movieId, setMovieId] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [correct, setCorrect] = useState([]);
  const navigate = useNavigate();


  const deviceId = getDeviceId();

  //const hasFetched = useRef(false);

  useEffect(() => {
    // if (hasFetched.current) return;
    // hasFetched.current = true;
    console.log("Industry changed → fetching new movie:", industry);
    loadMovie();
    localStorage.setItem("industry", industry);
  }, [industry]);

  // useEffect(() => {
  //   loadMovie();
  // }, [industry]);

  
  function maskMovie(title) {
    return title
      .split("")
      .map(ch => {
        // Space
        if (ch === " ") return " ";
        if (ch === "-") return " - ";

        // Vowel
        if (vowels.includes(ch)) return ch;
  
        // Number or special character
        if (!/[A-Z]/.test(ch)) return ch;
  
        // Consonant
        return "_";
      })
      .join("");
  }
  

  async function loadMovie() {
    setGuessed([]);
    setCorrect([]);
    setLives(3);
    setMovie("");
    setMasked("");
    setMovieId(null);
  
    const res = await fetch(
      `${API_BASE}/movie?industry=${industry}&deviceId=${deviceId}`
    );
    const data = await res.json();
  
    setMovieId(data.id);
    setMovie(data.title);
    setMasked(maskMovie(data.title));
  }
  

  function handleGuess(letter) {
    if (guessed.includes(letter)) return;

    setGuessed(prev => [...prev, letter]);

    if (movie.includes(letter)) {
      setCorrect(prev => [...prev, letter]);
      reveal(letter);
    } else {
      setLives(l => l - 1);
    }
  }

  async function markMovieCompleted(movieId) {
    await fetch(`${API_BASE}/movie/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        deviceId,
        movieId,
        score: score + 10
      })
    });
  }
  

  async function reveal(letter) {
    const updated = movie
      .split("")
      .map((ch, i) =>
        ch === letter ? letter : masked[i]
      )
      .join("");

    setMasked(updated);

    if (!updated.includes("_")) {
      const newScore = score + 10;
      setScore(newScore);
      setResult("win");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);

      // setShowParticles(true);
      // setTimeout(() => setShowParticles(false), 700);

      await markMovieCompleted(movieId);

      setTimeout(loadMovie, 600);
    }
  }

  useEffect(() => {
    if (lives === 0) {
      setResult("lose");
      //alert(`Game Over 😢\nScore: ${score}`);
      setScore(0);
      //loadMovie();
    }
  }, [lives]);

  return (
    <div className={`app ${industry}`}>
      {isSwitching && <div className="reel-transition" />}
      <div className="game-container">
         <button 
          className="create-challenge-btn"
          onClick={() => navigate("/create")}
        >
          🎬 Play With Your Friends
        </button>
        <Header industry={industry} setIndustry={setIndustry} setIsSwitching={setIsSwitching} />
       

        <StatusBar lives={lives} score={score} />
        {showParticles && <Sparkles />}
        {showConfetti && <Confetti />}
        <MovieDisplay masked={masked} />
        <Keyboard guessed={guessed} correct={correct} onGuess={handleGuess} />
        <Actions onSkip={loadMovie} />
        {result === "lose" && (
          <div className="result-overlay">
            <div className="result-card">
              <h2>{"❌ Game Over"}</h2>
              <p>
                {`Score: ${score}`}
              </p>
              <button
                className="primary-btn"
                onClick={() => window.location.reload()}
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );  
}
