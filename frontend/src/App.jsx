import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import CreateChallenge from "./pages/CreateChallenge";
import ChallengeGame from "./pages/ChallengeGame";
import Multiplayer from "./pages/Multiplayer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/create" element={<CreateChallenge />} />
        <Route path="/challenge/:id" element={<ChallengeGame />} />
        <Route path="/multiplayer/:roomName?" element={<Multiplayer />} />
      </Routes>
    </BrowserRouter>
  );
}
