import express from "express";

import CategoryController from "../controllers/category/Category.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  categorySlugParamSchema,
  createCategorySchema,
  updateCategoryQuerySchema,
  updateCategoryBodySchema,
  deleteCategoryQuerySchema,
} from "../validators/category/Category.validator.js";

const route = express.Router();

route
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    CategoryController.listCategories
  )
  .get(
    "/:slugs",
    requestValidator(categorySlugParamSchema, "params"),
    CategoryController.getCategory
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor", "agent"]),
    requestValidator(createCategorySchema, "body"),
    CategoryController.createCategory
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    requestValidator(deleteCategoryQuerySchema, "query"),
    CategoryController.deleteCategory
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    requestValidatorMultiple([
      { schema: updateCategoryQuerySchema, property: "query" },
      { schema: updateCategoryBodySchema, property: "body" },
    ]),
    CategoryController.updateCategory
  );

export default route;
