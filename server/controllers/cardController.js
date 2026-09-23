import Card from "../models/Card.js";
import List from "../models/List.js";
import BoardMember from "../models/BoardMember.js";

// POST /api/lists/:listId/cards
export const createCard = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Title is required" });

    const last = await Card.findOne({ list: req.list._id }).sort("-position");
    const position = last ? last.position + 1 : 0;

    const card = await Card.create({
      title: title.trim(),
      description: description || "",
      list: req.list._id,
      position,
    });
    res.status(201).json(card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/cards/:cardId - edit, drag-and-drop move, assign කිරීම ඔක්කොම මෙතනින්
export const updateCard = async (req, res) => {
  try {
    const { title, description, position, listId, assignedTo } = req.body;

    if (title !== undefined) req.card.title = title.trim();
    if (description !== undefined) req.card.description = description;
    if (position !== undefined) req.card.position = position;

    // card එක list එකකින් තව list එකකට drag කරාම
    if (listId !== undefined && listId !== String(req.card.list)) {
      const targetList = await List.findById(listId);
      if (!targetList || String(targetList.board) !== String(req.list.board))
        return res.status(400).json({ message: "Invalid target list" });
      req.card.list = targetList._id;
    }

    // card එකක් කෙනෙකුට assign කිරීම; ඒ කෙනා board එකේ member කෙනෙක් ද බලනවා
    if (assignedTo !== undefined) {
      if (assignedTo === null) {
        req.card.assignedTo = null;
      } else {
        const isMember = await BoardMember.findOne({ board: req.list.board, user: assignedTo });
        if (!isMember) return res.status(400).json({ message: "That user is not a board member" });
        req.card.assignedTo = assignedTo;
      }
    }

    await req.card.save();
    res.json(req.card);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/cards/:cardId
export const deleteCard = async (req, res) => {
  try {
    await req.card.deleteOne();
    res.json({ message: "Card deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};