import express from "express";
import {
  getApplications,
  getUserReferrals,
  getApplicationsByType,
} from "../controller/getApplicant.js";
import { createReferredApplication } from "../controller/createReferredApplication.js";
import { createSelfApplication } from "../controller/selfApplyRefer.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const router = express.Router();

router.post("/self-apply", createSelfApplication);
router.post(
  "/agent-apply",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor", "agent"]),
  createReferredApplication
);
router.get(
  "/",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor", "agent"]),
  getApplications
);
router.get(
  "/:type",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor", "agent"]),
  getApplicationsByType
);
router.get(
  "/",
  authenticateUser,
  getUserReferrals
);

export default router;
