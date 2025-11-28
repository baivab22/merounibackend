import express from "express";

import ProgramController from "../controllers/program/Program.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const router = express.Router();

router.get("/", ProgramController.listPrograms);
router.get("/:slugs", ProgramController.getProgram);
router.post(
  "/",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor", "agent"]),
  ProgramController.createOrUpdateProgram
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor"]),
  ProgramController.deleteProgram
);

export default router;
