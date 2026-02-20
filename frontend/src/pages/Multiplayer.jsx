import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate, useParams } from "react-router-dom";
import Keyboard from "../components/Keyboard";

const socket = io(import.meta.env.VITE_API_BASE.replace("/api", ""));

export default function Multiplayer() {

  const navigate = useNavigate();
  const { roomName } = useParams();

  const [room, setRoom] = useState("");
  const [status, setStatus] = useState("");
  const [players, setPlayers] = useState(0);
  const [masked, setMasked] = useState("");
  const [currentTurn, setCurrentTurn] = useState(null);
  const [myId, setMyId] = useState("");
  const [movie, setMovie] = useState("");
  const [inRoom, setInRoom] = useState(false);
  const [host, setHost] = useState(null);
  const [guesser, setGuesser] = useState(null);
  const [setter, setSetter] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
// structure: { type: "win" | "lose", movie: "" }

  function createRoom() {
    if (!room.trim()) return;

    socket.emit("create_room", room, (response) => {
        if (response.error) {
            setStatus(response.error);
            if(response.error == "Room already exists"){
              setError("Room already exists!");
            }
        } else {
            setInRoom(true);
            setError(null);
            navigate(`/multiplayer/${room}`);
        }
    });
 }

 useEffect(() => {
    if (roomName) {
      setRoom(roomName);
  
      socket.emit("join_room", roomName, (response) => {
        if (response.error) {
          setStatus(response.error);
          navigate("/multiplayer");
        } else {
          setInRoom(true);
        }
      });
    }
  }, [roomName]);
  
  function joinRoom() {
    socket.emit("join_room", room, (response) => {
      if (response.error) {
        setStatus(response.error);
        navigate("/multiplayer");
      } else {
        setStatus("Joined room!");
      }
    });
  }

  socket.on("next_round", (data) => {
    setMasked("");
    setGuesser(null);
    setSetter(data.setter);
  });
  
  socket.on("room_update", (data) => {
    setPlayers(data.players);
    setSetter(data.setter);
  });

  socket.on("connect", () => {
    setMyId(socket.id);
  });


  useEffect(() => {
    socket.on("game_start", (data) => {
      setMasked(data.masked);
      setGuesser(data.guesser);
    });
  
    socket.on("game_update", (data) => {
      setMasked(data.masked);
    });
  
   socket.on("game_over", (data) => {
    if (data.winner === myId) {
      setResult({ type: "win", movie: data.movie });
    } else {
      setResult({ type: "lose", movie: data.movie });
    }
    setMasked("");
  });
  
    return () => {
      socket.off("game_start");
      socket.off("game_update");
      socket.off("game_over");
    };
  }, [myId]);
  
  
  return (
    <div className="card">
    <h2>🎮 Multiplayer Room</h2>

    {/* Room Input */}
    {!inRoom && (
  <>
    <input
      className="input"
      placeholder="Enter room name"
      value={room}
      onChange={e => setRoom(e.target.value)}
    />

    <button className="primary-btn" onClick={createRoom}>
      Create Room
    </button>
    {error !== null && (
      <p>{error}</p>
    )}
  </>
)}


    <p style={{ marginTop: 10 }}>
        Players: {players}/2
    </p>

    {/* 👇 THIS IS WHERE YOU ADD MOVIE INPUT */}
    {players === 2 && !masked && setter === myId && (
        <>
        <h3 style={{ marginTop: 20 }}>
            🎬 Enter Movie to Start
        </h3>

        <input
            className="input"
            placeholder="Enter movie name"
            value={movie}
            onChange={e => setMovie(e.target.value)}
        />

        <button
            className="primary-btn"
            onClick={() =>
            socket.emit("set_movie", {
                roomName: room,
                movie
            })
            }
        >
            Start Game
        </button>
        </>
    )}
    {players === 2 && !masked && setter !== myId && (
      <>
      <p>👀 Waiting for opponent to give a movie...</p>
      </>
    )}
    {players === 1 && !masked && setter === myId && (
      <>
      <p>👀 Waiting for opponent to join the room...</p>
      </>
    )}
    {/* 👇 Game UI after start */}
    {masked && (
        <>
            <h3>{masked}</h3>

            {guesser === myId ? (
            <>
                <p>🎯 Your Turn to Guess</p>
                <Keyboard
                guessed={[]}
                onGuess={(letter) =>
                    socket.emit("guess_letter", {
                    roomName: room,
                    letter
                    })
                }
                />
            </>
            ) : (
            <p>👀 Waiting for opponent to guess...</p>
            )}
        </>
        )}
      {result && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h2>
              {result.type === "win" ? "🎉 You Win!" : "😢 You Lose!"}
            </h2>

            <p style={{ marginTop: 10 }}>
              Movie was:
            </p>

            <h3 style={{ marginTop: 5 }}>
              {result.movie}
            </h3>

            <button
              className="primary-btn"
              style={{ marginTop: 20 }}
              onClick={() => setResult(null)}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );  
}
