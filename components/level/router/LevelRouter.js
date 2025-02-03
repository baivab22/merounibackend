import express from "express";

// user controller
import { getAllLevels, getLevellById } from "../controllers/ListLevel.js";
import { createLevel } from "../controllers/CreateLevel.js";
import { deleteLevel } from "../controllers/DeleteLevel.js";
import { updateTag } from "../controllers/UpdateLevel.js";

const route = express.Router();

route
  .get("/", getAllLevels)
  .get("/", getLevellById)
  .post("/", createLevel)
  .delete("/", deleteLevel)
  .put("/", updateTag);

export default route;
