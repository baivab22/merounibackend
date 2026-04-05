import express from "express";
import BoardController from "../controllers/board/Board.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";


const router = express.Router();

router.get("/", BoardController.listBoards);
router.get("/:id", BoardController.getBoard);

router.post(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  BoardController.createBoard
);

router.patch(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  BoardController.updateBoard
);

router.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  BoardController.deleteBoard
);

export default router;
