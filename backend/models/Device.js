import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, unique: true },
  score: { type: Number, default: 0 },
  moviesPlayed: { type: [Number], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Device", deviceSchema);
