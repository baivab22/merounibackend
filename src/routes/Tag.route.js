import express from "express";

import TagController from "../controllers/tag/Tag.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", TagController.listTags)
  .get("/:tag_id", TagController.getTag)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    TagController.createTag
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    TagController.deleteTag
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    TagController.updateTag
  );

export default route;
