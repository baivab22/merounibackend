import express from "express";
import { getBanners, getBannersById } from "../controller/GetBanner.js";
import { createBanner } from "../controller/CreateOrUpdateBanner.js";
import { deleteBanner } from "../controller/DeleteBanner.js";

const router = express.Router();

router
  .post("/", createBanner)
  .get("/", getBanners)
  .get("/:id", getBannersById)
  .delete("/:id", deleteBanner);

export default router;
