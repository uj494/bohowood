import express from "express";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import movieRoutes from "./routes/movie.routes.js";
import challengeRoutes from "./routes/challenge.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

app.use("/api/movie", movieRoutes);
app.use("/api/challenge", challengeRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://bohowood.vercel.app"
  }
});

const rooms = {}; 
// {
//   roomName: {
//     players: [socket1, socket2],
//     movie: "",
//     masked: "",
//     guessed: [],
//     currentTurn: socketId
//   }
// }


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("set_movie", ({ roomName, movie }) => {
    const room = rooms[roomName];
    if (!room) return;
  
    room.movie = movie.toUpperCase();
    room.masked = maskMovie(movie);
    room.guessed = [];
  
    // Guessing player = the OTHER player
    room.guesser = room.players.find(id => id !== room.setter);
  
    io.to(roomName).emit("game_start", {
      masked: room.masked,
      guesser: room.guesser,
      setter: room.setter
    });
  });
  

  socket.on("guess_letter", ({ roomName, letter }) => {
    const room = rooms[roomName];
    if (!room) return;  
    if (!room.movie) return;

    // Only guesser can guess
    if (socket.id !== room.guesser) return;
  
    if (room.guessed.includes(letter)) return;
  
    room.guessed.push(letter);
  
    if (room.movie.includes(letter)) {
      room.masked = room.movie
        .split("")
        .map((ch, i) =>
          ch === letter ? letter : room.masked[i]
        )
        .join("");
    }
  
    // Check win
    if (!room.masked.includes("_")) {
      io.to(roomName).emit("game_over", {
        winner: room.guesser,
        movie: room.movie
      });

      // 🔥 Reset round immediately
      const nextSetter = room.guesser;
      room.setter = nextSetter;
      room.movie = "";
      room.masked = "";
      room.guessed = [];
      room.guesser = null;

      io.to(roomName).emit("next_round", {
        setter: room.setter
      });
      
      return;
    }
  
    io.to(roomName).emit("game_update", {
      masked: room.masked
    });
  });
  
  
  socket.on("create_room", (roomName, callback) => {
    if (rooms[roomName]) {
      return callback({ error: "Room already exists" });
    }

    rooms[roomName] = {
      players: [socket.id],
      setter: socket.id,
      movie: "",
      masked: "",
      guessed: [],
      guesser: null
    };
    

    socket.join(roomName);

    io.to(roomName).emit("room_update", {
      players: 1,
      setter: socket.id
    });

    callback({ success: true });
  });

  socket.on("join_room", (roomName, callback) => {
    const room = rooms[roomName];
  
    // 🚨 Room does not exist
    if (!room) {
      return callback({ error: "Room not found" });
    }
  
    // Prevent duplicate join
    if (room.players.includes(socket.id)) {
      return callback({ success: true });
    }
  
    // Room full
    if (room.players.length >= 2) {
      return callback({ error: "Room is full" });
    }
  
    room.players.push(socket.id);
    socket.join(roomName);
  
    io.to(roomName).emit("room_update", {
      players: room.players.length,
      setter: room.setter
    });
  
    callback({ success: true });
  });

  socket.on("disconnect", () => {
    for (const roomName in rooms) {
      const room = rooms[roomName];

      room.players = room.players.filter(id => id !== socket.id);

      if (room.players.length === 0) {
        delete rooms[roomName];
      }
    }
  });
});

function maskMovie(title) {
  const vowels = ["A","E","I","O","U"];

  return title
    .toUpperCase()
    .split("")
    .map(ch =>
      ch === " " || vowels.includes(ch) || !/[A-Z]/.test(ch)
        ? ch
        : "_"
    )
    .join("");
}

server.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});

// app.listen(process.env.PORT, () =>
//   console.log(`Server running on port ${process.env.PORT}`)
// );
