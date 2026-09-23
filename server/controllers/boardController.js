import Board from "../models/Board.js";
import BoardMember from "../models/BoardMember.js";
import List from "../models/List.js";
import Card from "../models/Card.js";
import User from "../models/User.js";

// GET /api/boards - user කෙනා member වෙලා ඉන්න boards ඔක්කොම
export const getBoards = async (req, res) => {
  try {
    const memberships = await BoardMember.find({ user: req.user._id }).populate("board");
    const boards = memberships
      .filter((m) => m.board) // board එක delete වෙලා memberships ඉතුරු වෙලා තියෙනවා නම් skip
      .map((m) => ({ ...m.board.toObject(), role: m.role }));
    res.json(boards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/boards
export const createBoard = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Title is required" });

    const board = await Board.create({ title: title.trim(), description, owner: req.user._id });
    await BoardMember.create({ board: board._id, user: req.user._id, role: "OWNER" });

    res.status(201).json({ ...board.toObject(), role: "OWNER" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/boards/:boardId - board එකයි, lists, cards, members ඔක්කොම එකට
export const getBoard = async (req, res) => {
  try {
    const lists = await List.find({ board: req.board._id }).sort("position");
    const cards = await Card.find({ list: { $in: lists.map((l) => l._id) } }).sort("position");
    const members = await BoardMember.find({ board: req.board._id }).populate("user", "name email");

    res.json({
      board: req.board,
      role: req.membership.role,
      lists,
      cards,
      members: members.map((m) => ({
        id: m.user._id,
        name: m.user.name,
        email: m.user.email,
        role: m.role,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/boards/:boardId - owner විතරයි
export const updateBoard = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (title !== undefined) req.board.title = title.trim();
    if (description !== undefined) req.board.description = description;
    await req.board.save();
    res.json(req.board);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/boards/:boardId - owner විතරයි; lists, cards, members ඔක්කොම එක්කම delete
export const deleteBoard = async (req, res) => {
  try {
    const lists = await List.find({ board: req.board._id });
    await Card.deleteMany({ list: { $in: lists.map((l) => l._id) } });
    await List.deleteMany({ board: req.board._id });
    await BoardMember.deleteMany({ board: req.board._id });
    await req.board.deleteOne();
    res.json({ message: "Board deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/boards/:boardId/members - owner විතරයි; email එකෙන් invite කරනවා
export const addMember = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: "No user with that email" });

    const exists = await BoardMember.findOne({ board: req.board._id, user: user._id });
    if (exists) return res.status(409).json({ message: "Already a member" });

    const membership = await BoardMember.create({ board: req.board._id, user: user._id, role: "MEMBER" });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: membership.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/boards/:boardId/members/:userId - owner විතරයි
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId === String(req.board.owner))
      return res.status(400).json({ message: "The owner can't be removed" });

    await BoardMember.deleteOne({ board: req.board._id, user: userId });
    res.json({ message: "Member removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};