import express from "express";

import TagController from "../controllers/tag/Tag.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  tagIdParamSchema,
  createTagSchema,
  updateTagQuerySchema,
  updateTagBodySchema,
  deleteTagQuerySchema,
} from "../validators/tag/Tag.validator.js";

const route = express.Router();

route
  .get("/", requestValidator(paginationSchema, "query"), TagController.listTags)
  .get(
    "/:tag_id",
    requestValidator(tagIdParamSchema, "params"),
    TagController.getTag
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(createTagSchema, "body"),
    TagController.createTag
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(deleteTagQuerySchema, "query"),
    TagController.deleteTag
  )
  .put(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidatorMultiple([
      { schema: updateTagQuerySchema, property: "query" },
      { schema: updateTagBodySchema, property: "body" },
    ]),
    TagController.updateTag
  );

export default route;
