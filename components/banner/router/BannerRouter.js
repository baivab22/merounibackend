import express from "express";
import { getBanners, getBannersById } from "../controller/GetBanner.js";
import { createBanner } from "../controller/CreateOrUpdateBanner.js";
import { deleteBanner, deleteBannerGalleryItem } from "../controller/DeleteBanner.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const router = express.Router();

router
  .post(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin", "editor"]),
    createBanner
  )
  .get("/", getBanners)
  .get("/:id", getBannersById)
  .delete(
    "/:id",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    deleteBanner
  )
  .delete(
    "/:galleryId/delete",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    deleteBannerGalleryItem
  );

export default router;
