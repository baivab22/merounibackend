import express from "express";

// user controller
import {
  listConsultancy,
  listSingleConsultancy,
} from "../controller/ListConsultancy.js";
import { createOrUpdateConsultancy } from "../controller/CreateOrEditConsultancy.js";
import { deleteConsultancy } from "../controller/DeleteConsultancy.js";
// import { updateBlog } from "../controllers/UpdateNews.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", listConsultancy)
  .get("/:slugs", listSingleConsultancy)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    createOrUpdateConsultancy
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    deleteConsultancy
  );

export default route;
