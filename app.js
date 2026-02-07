const vowels = ["A", "E", "I", "O", "U"];

let state = {
  industry: "bollywood",
  lives: 3,
  score: 0,
  movie: "",
  maskedMovie: "",
  guessedLetters: [],
};

function getDeviceId() {
    let id = localStorage.getItem("device_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("device_id", id);
    }
    return id;
  }
  
  const DEVICE_ID = getDeviceId();

  const TMDB_API_KEY = "fe20a51ad3e8a5576796029de60bbca2"; // TEMP – move to backend later
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

async function fetchMovieFromTMDB(industry) {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: "en-US",
      sort_by: "popularity.desc",
      page: Math.floor(Math.random() * 5) + 1
    });
  
    // Bollywood = Hindi movies
    if (industry === "bollywood") {
      params.append("with_original_language", "hi");
      params.append("region", "IN");
    } else {
      params.append("with_original_language", "en");
    }
  
    const url = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;
  
    const res = await fetch(url);
    const data = await res.json();
  
    // Pick random movie from results
    const movie = data.results[Math.floor(Math.random() * data.results.length)];
  
    return {
      id: movie.id,
      title: movie.title.toUpperCase()
    };
  }

  
  const MOVIES = {
    bollywood: [
      "KABIR SINGH",
      "BAJIRAO MASTANI",
      "DIL CHAHTA HAI",
      "3 IDIOTS"
    ],
    hollywood: [
      "INTERSTELLAR",
      "FIGHT CLUB",
      "THE DARK KNIGHT",
      "INCEPTION"
    ]
  };

  function maskMovie(name) {
    return name
      .split("")
      .map(ch => {
        if (ch === " ") return " ";
        if (vowels.includes(ch)) return ch;
        return "_";
      })
      .join("");
  }

  function renderMovie() {
    const container = document.querySelector(".movie-display");
    container.innerHTML = "";
  
    state.maskedMovie.split("").forEach(ch => {
      const div = document.createElement("div");
      div.className = "letter";
      if (ch === " ") {
        div.classList.add("space");
        div.innerHTML = "";
      } else {
        div.innerHTML = ch;
      }
      container.appendChild(div);
    });
  }

  async function loadMovie() {

    resetKeyboard();
    state.guessedLetters = [];
  
    const res = await fetch(
      `http://localhost:5000/api/movie?industry=${state.industry}&deviceId=${DEVICE_ID}`
    );
    const data = await res.json();
    console.log(data);
    state.movie = sanitizeTitle(data.title);
    state.maskedMovie = maskMovie(state.movie);
  
    renderMovie();
  }

  function sanitizeTitle(title) {
    return title
      .replace(/[^A-Z0-9 :]/g, "") // remove weird chars
      .trim();
  }
  

  document.querySelectorAll(".key").forEach(btn => {
    btn.addEventListener("click", () => {
      const letter = btn.innerText;
      handleGuess(letter, btn);
    });
  });

  function handleGuess(letter, btn) {
    if (state.guessedLetters.includes(letter)) return;
  
    state.guessedLetters.push(letter);
  
    if (state.movie.includes(letter)) {
      btn.classList.add("correct");
      revealLetter(letter);
      checkWin();
    } else {
      btn.classList.add("wrong");
      loseLife();
    }
  
    btn.disabled = true;
  }

  function revealLetter(letter) {
    let updated = "";
  
    for (let i = 0; i < state.movie.length; i++) {
      if (state.movie[i] === letter) {
        updated += letter;
      } else {
        updated += state.maskedMovie[i];
      }
    }
  
    state.maskedMovie = updated;
    renderMovie();
  }

  function loseLife() {
    state.lives--;
    updateLives();
  
    if (state.lives === 0) {
      setTimeout(gameOver, 300);
    }
  }
  
  function updateLives() {
    document.querySelector(".lives").innerHTML = "❤️ ".repeat(state.lives);
  }

  function checkWin() {
    if (!state.maskedMovie.includes("_")) {
      state.score += 10;
      updateScore();
      setTimeout(loadMovie, 700);
    }
  }

  function updateScore() {
    document.getElementById("score").innerText = state.score;
  }

  function resetKeyboard() {
    document.querySelectorAll(".key").forEach(btn => {
      btn.disabled = false;
      btn.classList.remove("correct", "wrong");
    });
  }

  function gameOver() {
    alert(`Game Over 😢\nScore: ${state.score}`);
    resetGame();
  }
  
  function resetGame() {
    state.lives = 3;
    state.score = 0;
    updateLives();
    updateScore();
    loadMovie();
  }

  document.getElementById("bollywood").onclick = () => switchIndustry("bollywood");
document.getElementById("hollywood").onclick = () => switchIndustry("hollywood");

function switchIndustry(type) {
  state.industry = type;

  document.querySelectorAll(".toggle-btn").forEach(btn =>
    btn.classList.remove("active")
  );
  document.getElementById(type).classList.add("active");

  resetGame();
}

updateLives();
updateScore();
loadMovie();
