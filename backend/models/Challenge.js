import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  challengeId: { type: String, unique: true },
  movie: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Challenge", challengeSchema);
