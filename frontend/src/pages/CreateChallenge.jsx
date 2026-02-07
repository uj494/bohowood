import { useState } from "react";
import Layout from "../components/Layout";
import BackButton from "../components/BackButton";

export default function CreateChallenge() {
  const [movie, setMovie] = useState("");
  const [link, setLink] = useState("");

  async function createChallenge() {
    if (!movie.trim()) return;

    const res = await fetch("https://bohowood.onrender.com/api/challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ movie })
    });

    const data = await res.json();
    setLink(`${window.location.origin}/challenge/${data.challengeId}`);
  }

  return (
    <Layout classes="challenge">
      <BackButton />
      <h2>🎬 Create a Movie Challenge</h2>
      <p>Enter a movie and challenge your friends to guess it</p>

      <input
        className="input"
        placeholder="Enter movie name"
        value={movie}
        onChange={e => setMovie(e.target.value)}
      />

      <button className="primary-btn" onClick={createChallenge}>
        Generate Challenge Link
      </button>

      {link && (
        <div className="share-box">
          <input value={link} readOnly />
          <button
            className="secondary-btn"
            onClick={() => navigator.clipboard.writeText(link)}
          >
            📋 Copy Link
          </button>
        </div>
      )}
    </Layout>
  );
}
