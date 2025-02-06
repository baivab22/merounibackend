import express from "express";
import {
  getColleges,
  getCollegeById,
} from "../controller/CollegeController.js";

import { listSchoolController } from "../controller/GetSchoolController.js";

import { listAdmission } from "../controller/GetAdmission.js";

import { createOrUpdateCollege } from "../controller/RegisterCollege.js";
import { deleteCollege } from "../controller/DeleteCollege.js";

const router = express.Router();

router
  .post("/", createOrUpdateCollege)
  .get("/admission", listAdmission)
  .get("/list-school", listSchoolController)
  .get("/", getColleges)
  .get("/:slugs", getCollegeById)
  .delete("/:id", deleteCollege);

export default router;
