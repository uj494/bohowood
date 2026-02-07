export default function MovieDisplay({ masked }) {
    return (
      <div className="movie-display">
        {masked.split("").map((ch, i) =>
          ch === " " ? (
            <div key={i} className="letter space" />
          ) : (
            <div key={i} className="letter">{ch}</div>
          )
        )}
      </div>
    );
  }
  