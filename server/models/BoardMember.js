import mongoose from "mongoose";

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

// one user can only have one membership row per board
boardMemberSchema.index({ user: 1, board: 1 }, { unique: true });

export default mongoose.model("BoardMember", boardMemberSchema);