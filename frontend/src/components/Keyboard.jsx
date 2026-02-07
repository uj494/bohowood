const keys = "QWERTYUIOPASDFGHJKLZXCVBNM".split("");

export default function Keyboard({ guessed, correct, onGuess }) {
  return (
    <div className="keyboard">
      {keys.map(letter => {
        let className = "key";

        if (guessed.includes(letter)) {
          className += correct.includes(letter)
            ? " key-correct"
            : " key-wrong";
        }

        return (
          <button
            key={letter}
            className={className}
            disabled={guessed.includes(letter)}
            onClick={() => onGuess(letter)}
          >
            {letter}
          </button>
        );
      })}
    </div>
  );
}
