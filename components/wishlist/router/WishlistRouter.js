import express from "express";
import { getUserWishlist } from "../controller/GetWishlist.js";
import {
  addToWishlist,
  removeFromWishlist,
} from "../controller/AddOrRemoveWishlist.js";

const router = express.Router();

router.get("/", getUserWishlist);
router.post("/", addToWishlist);
router.delete("/", removeFromWishlist);

export default router;
