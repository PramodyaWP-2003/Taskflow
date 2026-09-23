import List from "../models/List.js";
import Card from "../models/Card.js";

// POST /api/boards/:boardId/lists
export const createList = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Title is required" });

    const last = await List.findOne({ board: req.board._id }).sort("-position");
    const position = last ? last.position + 1 : 0;

    const list = await List.create({ title: title.trim(), board: req.board._id, position });
    res.status(201).json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/lists/:listId - name එක වෙනස් කිරීම හෝ position (reorder)
export const updateList = async (req, res) => {
  try {
    const { title, position } = req.body;
    if (title !== undefined) req.list.title = title.trim();
    if (position !== undefined) req.list.position = position;
    await req.list.save();
    res.json(req.list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/lists/:listId - list එකේ cards ඔක්කොම එක්කම delete
export const deleteList = async (req, res) => {
  try {
    await Card.deleteMany({ list: req.list._id });
    await req.list.deleteOne();
    res.json({ message: "List deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};