import express from "express";
import { getBanners, getBannersById } from "../controller/GetBanner.js";
import { createBanner } from "../controller/CreateOrUpdateBanner.js";

const router = express.Router();

router.post("/", createBanner);
router.get("/", getBanners);
router.get("/:id", getBannersById);

export default router;
