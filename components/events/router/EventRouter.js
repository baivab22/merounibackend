import express from "express";
import { getEvents } from "../controllers/GetController.js";
import { createOrUpdateEvent } from "../controllers/CreateOrUpdateEvent.js";
import { deleteEvent } from "../controllers/DeleteEvent.js";

const router = express.Router();

router.get("/", getEvents);
router.post("/", createOrUpdateEvent);
// router.get("/:id", getExamById); // Get Single Exam
router.delete("/", deleteEvent); 

export default router;
