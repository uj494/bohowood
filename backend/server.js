import express from "express";
import mongoose from "mongoose";
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

app.use(
  express.static(path.join(__dirname, "frontend/dist"))
);

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "frontend/dist/index.html")
  );
});

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
