import { STATUS_COLORS } from "../utils/constants";

export const StatusBadge = ({ status }) => <span className={STATUS_COLORS[status] || "pill gray"}>{status}</span>;
