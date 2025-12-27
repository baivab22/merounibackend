import express from "express";

import CollegeController from "../controllers/college/College.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  collegeSlugParamSchema,
  collegeIdParamSchema,
  createOrUpdateCollegeSchema,
  updateCollegeOrderSchema,
} from "../validators/college/College.validator.js";

const router = express.Router();

router
  .post(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor", "agent"]),
    requestValidator(createOrUpdateCollegeSchema, "body"),
    CollegeController.createOrUpdateCollege
  )
  .get(
    "/admission",
    requestValidator(paginationSchema, "query"),
    CollegeController.listAdmissions
  )
  .get(
    "/list-school",
    requestValidator(paginationSchema, "query"),
    CollegeController.listSchools
  )
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    CollegeController.listColleges
  )
  .get(
    "/:slugs",
    requestValidator(collegeSlugParamSchema, "params"),
    CollegeController.getCollegeBySlug
  )
  .delete(
    "/:id",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(collegeIdParamSchema, "params"),
    CollegeController.deleteCollege
  )
  .get(
    "/institution/my-college",
    authenticateUser,
    authorizeRole(["institution"]),
    CollegeController.getCollegeByInstitutionUser
  )
  .put(
    "/institution/my-college",
    authenticateUser,
    authorizeRole(["institution"]),
    requestValidator(createOrUpdateCollegeSchema, "body"),
    CollegeController.updateCollegeByInstitutionUser
  )
  .put(
    "/order",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(updateCollegeOrderSchema, "body"),
    CollegeController.updateCollegeOrder
  );

export default router;
