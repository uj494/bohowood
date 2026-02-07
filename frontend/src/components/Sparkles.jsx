export default function Sparkles() {
    const particles = Array.from({ length: 50 }); // ⬅ more particles
  
    return (
      <div className="sparkles">
        {particles.map((_, i) => {
          const angle = Math.random() * 2 * Math.PI;
  
          // ⬇ BIGGER spread
          const distance = 60 + Math.random() * 60; // was ~30–50
  
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance - 30; // lift upward
  
          return (
            <span
              key={i}
              className="sparkle"
              style={{
                "--x": `${x}px`,
                "--y": `${y}px`,
              }}
            />
          );
        })}
      </div>
    );
  }
  