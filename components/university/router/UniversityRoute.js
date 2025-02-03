import express from "express";

// user controller
import {
  listAllUniversities,
  universityProfile,
} from "../controllers/GetUniversity.js";
import { createOrUpdateUniversity } from "../controllers/CreateUniversity.js";
import { deleteUniversity } from "../controllers/DeleteUniversity.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", listAllUniversities)
  .get("/:slug", universityProfile)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    createOrUpdateUniversity
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    deleteUniversity
  );

export default route;
