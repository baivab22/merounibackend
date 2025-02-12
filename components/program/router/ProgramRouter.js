import express from "express";
import { getAllPrograms, getProgramById } from "../controller/GetProgram.js";
import { createOrUpdateProgram } from "../controller/CreateProgram.js";
import { deleteProgram } from "../controller/DeleteProgram.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const router = express.Router();

router.get("/", getAllPrograms);
router.get("/:slugs", getProgramById);
router.post(
  "/",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor", "agent"]),
  createOrUpdateProgram
);
router.delete(
  "/:id",
  authenticateUser,
  authorizeRole(["super-admin", "admin"]),
  deleteProgram
);

export default router;
