import express from "express";

import NewsController from "../controllers/news/News.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  newsSlugParamSchema,
  createNewsSchema,
  updateNewsQuerySchema,
  updateNewsBodySchema,
  deleteNewsQuerySchema,
} from "../validators/news/News.validator.js";

const route = express.Router();

route
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    NewsController.listBlogs
  )
  .get(
    "/:slug",
    requestValidator(newsSlugParamSchema, "params"),
    NewsController.getBlog
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    requestValidator(createNewsSchema, "body"),
    NewsController.createBlog
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    requestValidator(deleteNewsQuerySchema, "query"),
    NewsController.deleteBlog
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    requestValidatorMultiple([
      { schema: updateNewsQuerySchema, property: "query" },
      { schema: updateNewsBodySchema, property: "body" },
    ]),
    NewsController.updateBlog
  );

export default route;
