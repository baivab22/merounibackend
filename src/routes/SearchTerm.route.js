import express from "express";
import SearchTermController from "../controllers/searchTerm/SearchTerm.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const router = express.Router();

router.get(
  "/admin",
  authenticateUser,
  authorizeRole(["admin"]),
  SearchTermController.listAdmin
);

router.delete(
  "/admin/:id",
  authenticateUser,
  authorizeRole(["admin"]),
  SearchTermController.remove
);

export default router;
