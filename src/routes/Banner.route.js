import express from "express";

import BannerController from "../controllers/banner/Banner.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  paginationSchema,
  bannerIdParamSchema,
  galleryIdParamSchema,
  createBannerSchema,
} from "../validators/banner/Banner.validator.js";

const router = express.Router();

router
  .post(
    "/",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(createBannerSchema, "body"),
    BannerController.createBanner
  )
  .get(
    "/",
    requestValidator(paginationSchema, "query"),
    BannerController.getBanners
  )
  .get(
    "/:id",
    requestValidator(bannerIdParamSchema, "params"),
    BannerController.getBannersById
  )
  .delete(
    "/:id",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(bannerIdParamSchema, "params"),
    BannerController.deleteBanner
  )
  .delete(
    "/:galleryId/delete",
    authenticateUser,
    authorizeRole(["admin", "editor"]),
    requestValidator(galleryIdParamSchema, "params"),
    BannerController.deleteBannerGalleryItem
  );

export default router;
