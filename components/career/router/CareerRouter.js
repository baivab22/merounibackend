import express from "express";

// user controller
import { listCareerController } from "../controller/ListCareerController.js";
import { createCareer } from "../controller/CreateCareerController.js";
import { deleteCareer } from "../controller/DeleteCareerController.js";
import { updateCareer } from "../controller/UpdateCareerController.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", listCareerController)
  .post("/", createCareer)
  .delete("/", deleteCareer)
  .put("/", updateCareer);

export default route;
