import express from "express";

import LevelController from "../controllers/level/Level.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", LevelController.listLevels)
  .get("/:slugs", LevelController.getLevel)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    LevelController.createLevel
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    LevelController.deleteLevel
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    LevelController.updateLevel
  );

export default route;
