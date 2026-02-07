import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import GameBoard from "../components/GameBoard";

export default function ChallengeGame() {
  const { id } = useParams();
  const [movie, setMovie] = useState("");

  useEffect(() => {
    fetch(`/api/challenge/${id}`)
      .then(res => res.json())
      .then(data => setMovie(data.movie.toUpperCase()));
  }, [id]);

  if (!movie) return null;

  return (
    <Layout classes="challenge">
      <h2 style={{ textAlign: "center", marginBottom: 6 }}>
        🎯 Movie Challenge
      </h2>
      <p style={{ textAlign: "center", fontSize: 13, color: "#aaa" }}>
        Guess the movie your friend challenged you with
      </p>

      <GameBoard
        movie={movie}
        hideScore
        onWin={() => {
          alert("🎉 You guessed it!");
        }}
      />
    </Layout>
  );
}
