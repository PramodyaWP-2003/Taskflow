import Board from "../models/Board.js";
import BoardMember from "../models/BoardMember.js";
import List from "../models/List.js";
import Card from "../models/Card.js";

// board id එකෙන් board එක load කරලා, logged-in user member ද කියලා බලනවා.
// member නම් req.board, req.membership attach කරනවා.
export const requireBoardMember = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) return res.status(404).json({ message: "Board not found" });

    const membership = await BoardMember.findOne({ board: board._id, user: req.user._id });
    if (!membership)
      return res.status(403).json({ message: "You are not a member of this board" });

    req.board = board;
    req.membership = membership;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// requireBoardMember එකේම, OWNER role එකට විතරක් ඉදිරියට යන්න දෙනවා.
export const requireBoardOwner = async (req, res, next) => {
  await requireBoardMember(req, res, () => {
    if (req.membership.role !== "OWNER")
      return res.status(403).json({ message: "Only the board owner can do this" });
    next();
  });
};

// list id එකෙන් list එක load කරලා, ඒකේ board එකට user member ද බලනවා.
// req.list, req.membership attach කරනවා.
export const requireListMember = async (req, res, next) => {
  try {
    const list = await List.findById(req.params.listId);
    if (!list) return res.status(404).json({ message: "List not found" });

    const membership = await BoardMember.findOne({ board: list.board, user: req.user._id });
    if (!membership)
      return res.status(403).json({ message: "You are not a member of this board" });

    req.list = list;
    req.membership = membership;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// card id එකෙන් card එක load කරලා, ඒකේ list → board එකට user member ද බලනවා.
// req.card, req.list, req.membership attach කරනවා.
export const requireCardMember = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.cardId);
    if (!card) return res.status(404).json({ message: "Card not found" });

    const list = await List.findById(card.list);
    if (!list) return res.status(404).json({ message: "List not found" });

    const membership = await BoardMember.findOne({ board: list.board, user: req.user._id });
    if (!membership)
      return res.status(403).json({ message: "You are not a member of this board" });

    req.card = card;
    req.list = list;
    req.membership = membership;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};