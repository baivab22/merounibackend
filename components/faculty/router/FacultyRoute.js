import express from "express";

// user controller
import { getAllFaculty, getFacultyById } from "../controllers/ListFaculty.js";
import { createFaculty } from "../controllers/CreateFaculty.js";
import { deleteFaculty } from "../controllers/DeleteFaculty.js";
import { updateFaculty } from "../controllers/UpdateFaculty.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", getAllFaculty)
  .get("/:slugs", getFacultyById)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    createFaculty
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    deleteFaculty
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    updateFaculty
  );

export default route;
