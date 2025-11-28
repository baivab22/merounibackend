import express from "express";

import MaterialController from "../controllers/material/Material.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", MaterialController.listMaterials)
  .get("/:id", MaterialController.getMaterial)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    MaterialController.createMaterial
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    MaterialController.deleteMaterial
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    MaterialController.updateMaterial
  );

export default route;
