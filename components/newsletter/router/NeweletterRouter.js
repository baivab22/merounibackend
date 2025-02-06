import express from "express";

// user controller
import { listNewsletter } from "../controller/ListNewsLetter.js";
import { createNewsletter } from "../controller/CreateNewsletter.js";
// import { deleteMaterial } from "../controllers/DeleteMaterial.js";
// import { updateMaterial } from "../controllers/UpdateMaterial.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const route = express.Router();

route.get("/", listNewsletter)
//   .get("/", getMaterialById)
  .post(
    "/",
    // authenticateUser,
    // authorizeRole(["super-admin", "admin", "editor"]),
    createNewsletter
  )
//   .delete(
//     "/",
//     authenticateUser,
//     authorizeRole(["super-admin", "admin"]),
//     deleteMaterial
//   )
//   .put(
//     "/",
//     authenticateUser,
//     authorizeRole(["super-admin", "admin", "editor"]),
//     updateMaterial
//   );

export default route;
