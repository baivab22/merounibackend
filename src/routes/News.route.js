import express from "express";

import NewsController from "../controllers/news/News.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", NewsController.listBlogs)
  .get("/:slug", NewsController.getBlog)
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    NewsController.createBlog
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    NewsController.deleteBlog
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    NewsController.updateBlog
  );

export default route;
