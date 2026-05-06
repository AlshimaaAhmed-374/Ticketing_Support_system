import { PRIORITY_COLORS } from "../utils/constants";

export const PriorityBadge = ({ priority }) => (
  <span className={PRIORITY_COLORS[priority] || "pill gray"}>{priority}</span>
);
