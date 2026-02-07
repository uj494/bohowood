export default function StatusBar({ lives, score }) {
    return (
      <div className="status-bar">
        <div>{"❤️ ".repeat(lives)}</div>
        <div>⭐ {score}</div>
      </div>
    );
  }
  