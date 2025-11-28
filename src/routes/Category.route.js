import express from "express";

import CategoryController from "../controllers/category/Category.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", CategoryController.listCategories)
  .get("/:slugs", CategoryController.getCategory)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor", "agent"]),
    CategoryController.createCategory
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    CategoryController.deleteCategory
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    CategoryController.updateCategory
  );

export default route;
