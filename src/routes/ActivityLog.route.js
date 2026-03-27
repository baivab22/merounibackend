import express from "express";
import ActivityLogController from "../controllers/activityLog/ActivityLog.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const router = express.Router();

router.get(
  "/",
  authenticateUser,
  authorizeRole(["admin"]),
  ActivityLogController.getActivityLogs
);

export default router;
