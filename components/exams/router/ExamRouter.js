import express from "express";
import { createOrUpdateExam } from "../controller/NewExam.js";
import { getAllExams, getExam } from "../controller/ListExam.js";

const router = express.Router();

router.get("/", getAllExams);
router.post("/", createOrUpdateExam);
router.get("/:slugs", getExam);
// router.delete("/:id", deleteExam); // Delete Exam

export default router;
