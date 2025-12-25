import express from "express";

import AnalyticsController from "../controllers/analytics/Analytics.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

route.get(
  "/admin-overview",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor"]),
  AnalyticsController.getAdminOverview
);

export default route;
