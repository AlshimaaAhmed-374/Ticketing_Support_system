const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true },
    createdByUsername: { type: String, required: true },
    assignedAgentId: { type: mongoose.Schema.Types.ObjectId, default: null },
    assignedAgentName: { type: String, default: null },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    status: { type: String, enum: ["open", "in-progress", "closed"], default: "open" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ticket", ticketSchema);
