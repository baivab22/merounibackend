import express from "express";

import ExamController from "../controllers/exam/Exam.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  examSlugParamSchema,
  examIdParamSchema,
  createOrUpdateExamSchema,
} from "../validators/exam/Exam.validator.js";

const router = express.Router();

router.get(
  "/",
  requestValidator(paginationSchema, "query"),
  ExamController.listExams
);
router.post(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(createOrUpdateExamSchema, "body"),
  ExamController.createOrUpdateExam
);
router.get(
  "/:slugs",
  requestValidator(examSlugParamSchema, "params"),
  ExamController.getExam
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  requestValidator(examIdParamSchema, "params"),
  ExamController.deleteExam
);

export default router;
