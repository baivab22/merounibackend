import express from "express";

import MaterialCategoryController from "../controllers/material/MaterialCategory.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  materialCategoryIdParamSchema,
  createMaterialCategorySchema,
  updateMaterialCategoryQuerySchema,
  updateMaterialCategoryBodySchema,
  deleteMaterialCategoryQuerySchema,
} from "../validators/material/MaterialCategory.validator.js";

const route = express.Router();

route
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    MaterialCategoryController.listCategories
  )
  .get(
    "/:id",
    requestValidator(materialCategoryIdParamSchema, "params"),
    MaterialCategoryController.getCategory
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(createMaterialCategorySchema, "body"),
    MaterialCategoryController.createCategory
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(deleteMaterialCategoryQuerySchema, "query"),
    MaterialCategoryController.deleteCategory
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidatorMultiple([
      { schema: updateMaterialCategoryQuerySchema, property: "query" },
      { schema: updateMaterialCategoryBodySchema, property: "body" },
    ]),
    MaterialCategoryController.updateCategory
  );

export default route;
