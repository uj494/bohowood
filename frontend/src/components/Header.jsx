export default function Header({ industry, setIndustry, setIsSwitching }) {
    return (
      <div className="header">
        <div className="toggle">
            <button
            className={`toggle-btn ${industry === "bollywood" ? "active" : ""}`}
            onClick={() => {
                if (industry === "bollywood") return;

                setIsSwitching(true);
                console.log("Bollywood button clicked");
                setIndustry("bollywood");
                setTimeout(() => setIsSwitching(false), 500);
            }}
            >
            🎥 Bollywood
            </button>

            <button
            className={`toggle-btn ${industry === "hollywood" ? "active" : ""}`}
            onClick={() => {
                if (industry === "hollywood") return;

                setIsSwitching(true);
                setIndustry("hollywood");
                setTimeout(() => setIsSwitching(false), 500);
            }}
            >
            🎬 Hollywood
            </button>


        </div>
      </div>
    );
  }
  