import express from "express";
import { protect } from "../middleware/auth.js";
import { requireBoardMember, requireBoardOwner } from "../middleware/boardAccess.js";
import {
  getBoards,
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
  addMember,
  removeMember,
} from "../controllers/boardController.js";
import { createList } from "../controllers/listController.js";

const router = express.Router();

router.use(protect); 

router.get("/", getBoards);
router.post("/", createBoard);

router.get("/:boardId", requireBoardMember, getBoard);
router.patch("/:boardId", requireBoardOwner, updateBoard);
router.delete("/:boardId", requireBoardOwner, deleteBoard);

router.post("/:boardId/members", requireBoardOwner, addMember);
router.delete("/:boardId/members/:userId", requireBoardOwner, removeMember);

router.post("/:boardId/lists", requireBoardMember, createList);

export default router;