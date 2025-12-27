import express from "express";

import MaterialController from "../controllers/material/Material.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  materialIdParamSchema,
  createMaterialSchema,
  updateMaterialQuerySchema,
  updateMaterialBodySchema,
  deleteMaterialQuerySchema,
  materialCategoryQuerySchema,
} from "../validators/material/Material.validator.js";

const route = express.Router();

route
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    MaterialController.listMaterials
  )
  .get(
    "/category",
    requestValidator(materialCategoryQuerySchema, "query"),
    MaterialController.listMaterialsByCategory
  )
  .get(
    "/:id",
    requestValidator(materialIdParamSchema, "params"),
    MaterialController.getMaterial
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(createMaterialSchema, "body"),
    MaterialController.createMaterial
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["admin"]),
    requestValidator(deleteMaterialQuerySchema, "query"),
    MaterialController.deleteMaterial
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidatorMultiple([
      { schema: updateMaterialQuerySchema, property: "query" },
      { schema: updateMaterialBodySchema, property: "body" },
    ]),
    MaterialController.updateMaterial
  );

export default route;
