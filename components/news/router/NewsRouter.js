import express from "express";

// user controller
import { getAllBlogs, getBlogById } from "../controllers/ListNews.js";
import { createBlog } from "../controllers/CreateNews.js";
import { deleteBlog } from "../controllers/DeleteNews.js";
import { updateBlog } from "../controllers/UpdateNews.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", getAllBlogs)
  .get("/:slugs", getBlogById)
  .post(
    "/",
    // authenticateUser,
    // authorizeRole(["super-admin", "admin", "editor"]),
    createBlog
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    deleteBlog
  )
  .put(
    "/",
    // authenticateUser,
    // authorizeRole(["super-admin", "admin", "editor"]),
    updateBlog
  );

export default route;
