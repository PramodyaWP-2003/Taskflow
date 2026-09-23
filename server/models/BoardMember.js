const mongoose = require("mongoose");

const boardMemberSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },

    role: {
      type: String,
      enum: ["OWNER", "MEMBER"],
      default: "MEMBER",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BoardMember", boardMemberSchema);