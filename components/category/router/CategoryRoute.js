import express from "express";

// user controller
import {
  getAllCategories,
  getCategory,
} from "../controllers/ListCategory.js";
import { createCategory } from "../controllers/CreateCategory.js";
import { deleteCategory } from "../controllers/DeleteCategory.js";
import { updateCategory } from "../controllers/UpdateCategory.js";

const route = express.Router();

route
  .get("/", getAllCategories)
  .get("/:slugs", getCategory)
  .post("/", createCategory)
  .delete("/", deleteCategory)
  .put("/", updateCategory);

export default route;
