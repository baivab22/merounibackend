import express from "express";

// user controller
import { getAllFaculty, getFacultyById } from "../controllers/ListFaculty.js";
import { createFaculty } from "../controllers/CreateFaculty.js";
import { deleteFaculty } from "../controllers/DeleteFaculty.js";
import { updateFaculty } from "../controllers/UpdateFaculty.js";

const route = express.Router();

route
  .get("/", getAllFaculty)
  .get("/", getFacultyById)
  .post("/", createFaculty)
  .delete("/", deleteFaculty)
  .put("/", updateFaculty);

export default route;
