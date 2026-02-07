import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./pages/Game";
import CreateChallenge from "./pages/CreateChallenge";
import ChallengeGame from "./pages/ChallengeGame";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/create" element={<CreateChallenge />} />
        <Route path="/challenge/:id" element={<ChallengeGame />} />
      </Routes>
    </BrowserRouter>
  );
}
