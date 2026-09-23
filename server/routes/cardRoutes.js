import express from "express";
import { protect } from "../middleware/auth.js";
import { requireCardMember } from "../middleware/boardAccess.js";
import { updateCard, deleteCard } from "../controllers/cardController.js";

const router = express.Router();

router.use(protect);

router.patch("/:cardId", requireCardMember, updateCard);
router.delete("/:cardId", requireCardMember, deleteCard);

export default router;