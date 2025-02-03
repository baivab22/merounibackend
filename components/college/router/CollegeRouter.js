import express from "express";
import {
  getColleges,
  getCollegeById,
} from "../controller/CollegeController.js";

import { createOrUpdateCollege } from "../controller/RegisterCollege.js";
import { deleteCollege } from "../controller/DeleteCollege.js";

const router = express.Router();

router.post("/", createOrUpdateCollege);
router.get("/", getColleges);
router.get("/:id", getCollegeById);
router.delete("/:id", deleteCollege);

export default router;
