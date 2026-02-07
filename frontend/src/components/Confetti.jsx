export default function Confetti() {
    const pieces = Array.from({ length: 60 });
  
    return (
      <div className="confetti">
        {pieces.map((_, i) => {
          const angle = Math.random() * Math.PI * 2;
          const distance = 100 + Math.random() * 120;
  
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance - 60;
  
          const rotate = Math.random() * 360;
          const delay = Math.random() * 0.2;
  
          return (
            <span
              key={i}
              className="confetti-piece"
              style={{
                "--x": `${x}px`,
                "--y": `${y}px`,
                "--r": `${rotate}deg`,
                animationDelay: `${delay}s`,
              }}
            />
          );
        })}
      </div>
    );
  }
  