import express from "express";
import Device from "../models/Device.js";
import { fetchMovieFromTMDB } from "../services/tmdb.service.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { deviceId, industry } = req.query;

  if (!deviceId || !industry) {
    return res.status(400).json({ error: "Missing params" });
  }

  let device = await Device.findOne({ deviceId });
  if (!device) {
    device = await Device.create({ deviceId });
  }

  const movies = await fetchMovieFromTMDB(industry, process.env.TMDB_API_KEY);
  
  const unused = movies.find(
    m => !device.moviesPlayed.includes(m.id)
  );

  if (!unused) {
    return res.status(404).json({ error: "No new movies found" });
  }
  console.log(unused.title);
  res.json({
    id: unused.id,
    title: unused.title.toUpperCase()
  });
});

router.post("/complete", async (req, res) => {
  const { deviceId, movieId, score } = req.body;

  if (!deviceId || !movieId) {
    return res.status(400).json({ error: "Missing data" });
  }

  const device = await Device.findOneAndUpdate(
    { deviceId },
    {
      $addToSet: { moviesPlayed: movieId }, // prevents duplicates
      $set: { score }
    },
    { upsert: true, new: true }
  );

  res.json({ success: true });
});


router.post("/score", async (req, res) => {
  const { deviceId, score } = req.body;

  await Device.updateOne(
    { deviceId },
    { $set: { score } },
    { upsert: true }
  );

  res.json({ success: true });
});

export default router;
