import express from "express";

// user controller
import {
  getAllMaterials,
  getMaterialById,
} from "../controllers/ListMaterials.js";
import { createMaterial } from "../controllers/CreateMaterial.js";
import { deleteMaterial } from "../controllers/DeleteMaterial.js";
import { updateMaterial } from "../controllers/UpdateMaterial.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", getAllMaterials)
  .get("/", getMaterialById)
  .post(
    "/",
    // authenticateUser,
    // authorizeRole(["super-admin", "admin", "editor"]),
    createMaterial
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    deleteMaterial
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    updateMaterial
  );

export default route;
