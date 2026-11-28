import "./waking.css";

// Shown while the list is loading: shimmering placeholder cards, plus a note if it is slow.
export default function WakingNotice({ waking }) {
  return (
    <div>
      {waking && (
        <p className="waking" role="status">
          <span className="wake-spin" /> The server is waking up after being idle. The first visit can take up to a minute, please wait...
        </p>
      )}
      <div className="grid" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card skeleton">
            <div className="card-img" />
            <div className="card-body"><i /><i /><i /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
