import express from "express";

import ProgramController from "../controllers/program/Program.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  programSlugParamSchema,
  programIdParamSchema,
  createOrUpdateProgramSchema,
} from "../validators/program/Program.validator.js";

const router = express.Router();

router.get(
  "/",
  requestValidator(paginationSchema, "query"),
  ProgramController.listPrograms
);
router.get(
  "/:slugs",
  requestValidator(programSlugParamSchema, "params"),
  ProgramController.getProgram
);
router.post(
  "/",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor", "agent"]),
  requestValidator(createOrUpdateProgramSchema, "body"),
  ProgramController.createOrUpdateProgram
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor"]),
  requestValidator(programIdParamSchema, "params"),
  ProgramController.deleteProgram
);

export default router;
