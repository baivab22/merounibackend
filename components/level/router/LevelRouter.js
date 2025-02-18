import express from "express";

// user controller
import { getAllLevels, getLevellById } from "../controllers/ListLevel.js";
import { createLevel } from "../controllers/CreateLevel.js";
import { deleteLevel } from "../controllers/DeleteLevel.js";
import { updateTag } from "../controllers/UpdateLevel.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", getAllLevels)
  .get("/", getLevellById)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    createLevel
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    deleteLevel
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    updateTag
  );

export default route;
