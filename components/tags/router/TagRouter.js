import express from "express";

// user controller
import { getAllTags, getTagById } from "../controllers/ListTags.js";
import { createTag } from "../controllers/CreateTag.js";
import { deleteTag } from "../controllers/DeleteTag.js";
import { updateTag } from "../controllers/UpdateTag.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", getAllTags)
  .get("/:tag_id", getTagById)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    createTag
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    deleteTag
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    updateTag
  );

export default route;
