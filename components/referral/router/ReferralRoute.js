import express from "express";
import {
  getApplications,
  getApplicationsByType,
} from "../controller/getApplicant.js";
import { createReferredApplication } from "../controller/createReferredApplication.js";

import { createSelfApplication } from "../controller/selfApplyRefer.js";

const router = express.Router();

router.post("/self-apply", createSelfApplication);
router.post("/agent-apply", createReferredApplication);
router.get("/", getApplications);
router.get("/:type", getApplicationsByType);

export default router;
