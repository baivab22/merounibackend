import express from "express";
import MiscController from "../controllers/misc/Misc.controller.js";

const router = express.Router();

/**
 * @swagger
 * /misc/getCountryList:
 *   get:
 *     summary: Get a list of all countries
 *     tags: [Misc]
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/getCountryList", MiscController.getCountryList);
router.get("/countries", MiscController.getCountryList);

router.get("/getNepalDistrictList", MiscController.getNepalDistrictList);
router.get("/districts", MiscController.getNepalDistrictList);
router.get("/cities", MiscController.getNepalCityList);

export default router;
