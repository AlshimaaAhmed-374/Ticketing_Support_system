const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    message: { type: String, required: true, trim: true },
    respondedBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const supportSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    assignedAgentId: { type: mongoose.Schema.Types.ObjectId, default: null },
    assignedAgentName: { type: String, default: null },
    responses: { type: [responseSchema], default: [] },
    resolvedBy: { type: String, default: null },
    status: { type: String, enum: ["in-progress", "closed"], default: "in-progress" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Support", supportSchema);
