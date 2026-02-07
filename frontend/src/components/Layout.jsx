export default function Layout({ children, classes = "" }) {
    return (
      <div className={`app ${classes}`}>
        <div className="game-container">
          {children}
        </div>
      </div>
    );
  }
  