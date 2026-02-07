export default function Actions({ onSkip }) {
    return (
      <div className="actions">
        <button className="action-btn" onClick={onSkip}>⏭ Skip</button>
      </div>
    );
  }
  