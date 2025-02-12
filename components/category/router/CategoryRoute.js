import express from "express";

// user controller
import { getAllCategories, getCategory } from "../controllers/ListCategory.js";
import { createCategory } from "../controllers/CreateCategory.js";
import { deleteCategory } from "../controllers/DeleteCategory.js";
import { updateCategory } from "../controllers/UpdateCategory.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", getAllCategories)
  .get("/:slugs", getCategory)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor", "agent"]),
    createCategory
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    deleteCategory
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    updateCategory
  );

export default route;
