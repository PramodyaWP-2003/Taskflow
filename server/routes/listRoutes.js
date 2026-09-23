import express from "express";
import { protect } from "../middleware/auth.js";
import { requireListMember } from "../middleware/boardAccess.js";
import { updateList, deleteList } from "../controllers/listController.js";
import { createCard } from "../controllers/cardController.js";

const router = express.Router();

router.use(protect);

router.patch("/:listId", requireListMember, updateList);
router.delete("/:listId", requireListMember, deleteList);
router.post("/:listId/cards", requireListMember, createCard);

export default router;