import express from "express";
import Challenge from "../models/Challenge.js";
import crypto from "crypto";

const router = express.Router();

router.post("/", async (req, res) => {
  const { movie } = req.body;

  const challengeId = crypto.randomBytes(3).toString("hex");

  await Challenge.create({
    challengeId,
    movie: movie.toUpperCase()
  });

  res.json({ challengeId });
});

router.get("/:id", async (req, res) => {
  const challenge = await Challenge.findOne({
    challengeId: req.params.id
  });

  if (!challenge) {
    return res.status(404).json({ error: "Challenge not found" });
  }

  res.json({ movie: challenge.movie });
});

export default router;
