import express from "express";

import ExamController from "../controllers/exam/Exam.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const router = express.Router();

router.get("/", ExamController.listExams);
router.post(
  "/",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor"]),
  ExamController.createOrUpdateExam
);
router.get("/:slugs", ExamController.getExam);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor"]),
  ExamController.deleteExam
);

export default router;
