import express from "express";

import BannerController from "../controllers/banner/Banner.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";

const router = express.Router();

router
  .post(
    "/",
    // authenticateUser,
    // authorizeRole(["super-admin", "admin", "editor"]),
    BannerController.createBanner
  )
  .get("/", BannerController.getBanners)
  .get("/:id", BannerController.getBannersById)
  .delete(
    "/:id",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    BannerController.deleteBanner
  )
  .delete(
    "/:galleryId/delete",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    BannerController.deleteBannerGalleryItem
  );

export default router;
