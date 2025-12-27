import express from "express";
import CollegeRankingController from "../controllers/college/CollegeRanking.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import {
  requestValidator,
  requestValidatorMultiple,
} from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  createCollegeRankingSchema,
  updateRankingOrderSchema,
  deleteRankingQuerySchema,
  deleteProgramRankingsQuerySchema,
  getRankingsByProgramQuerySchema,
} from "../validators/college/CollegeRanking.validator.js";

const route = express.Router();

route
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    CollegeRankingController.listRankings
  )
  .get(
    "/program",
    requestValidator(getRankingsByProgramQuerySchema, "query"),
    CollegeRankingController.getRankingsByProgram
  )
  .post(
    "/",
    authenticateUser,
    authorizeRole(["admin"]),
    requestValidator(createCollegeRankingSchema, "body"),
    CollegeRankingController.createRanking
  )
  .put(
    "/order",
    authenticateUser,
    authorizeRole(["admin"]),
    requestValidator(updateRankingOrderSchema, "body"),
    CollegeRankingController.updateRankingOrder
  )
  .put(
    "/program-order",
    authenticateUser,
    authorizeRole(["admin"]),
    CollegeRankingController.updateProgramOrder
  )
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["admin"]),
    requestValidator(deleteRankingQuerySchema, "query"),
    CollegeRankingController.deleteRanking
  )
  .delete(
    "/program",
    authenticateUser,
    authorizeRole(["admin"]),
    requestValidator(deleteProgramRankingsQuerySchema, "query"),
    CollegeRankingController.deleteProgramRankings
  );

export default route;
