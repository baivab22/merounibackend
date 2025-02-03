import express from "express";
import { createOrUpdateExam } from "../controller/NewExam.js";
import { getAllExams } from "../controller/ListExam.js";

const router = express.Router();

router.get("/", getAllExams);
router.post("/", createOrUpdateExam); // Create or Update Exam
// Get All Exams
// router.get("/:id", getExamById); // Get Single Exam
// router.delete("/:id", deleteExam); // Delete Exam

export default router;
