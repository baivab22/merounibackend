import express from "express";
import { createOrUpdateExam } from "../controller/NewExam.js";
import { getAllExams, getExam } from "../controller/ListExam.js";
import { deleteExam } from "../controller/DeleteExam.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const router = express.Router();

router.get("/", getAllExams);
router.post(
  "/",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor"]),
  createOrUpdateExam
);
router.get("/:slugs", getExam);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor"]),
  deleteExam
);

export default router;
