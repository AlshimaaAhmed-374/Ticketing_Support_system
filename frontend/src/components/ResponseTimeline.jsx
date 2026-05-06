import { formatDateTime } from "../utils/format";

export const ResponseTimeline = ({ responses }) => {
  if (!responses?.length) return <p className="empty-text">No responses yet.</p>;

  return (
    <div className="timeline">
      {responses.map((item, idx) => (
        <div key={`${item.createdAt}-${idx}`} className="timeline-item">
          <div className="timeline-head">
            <strong>{item.respondedBy}</strong>
            <span>{formatDateTime(item.createdAt)}</span>
          </div>
          <p>{item.message}</p>
        </div>
      ))}
    </div>
  );
};
