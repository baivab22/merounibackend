import express from 'express';
import MiscController from '../controllers/misc/Misc.controller.js';

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
router.get('/getCountryList', MiscController.getCountryList);

/**
 * @swagger
 * /misc/getNepalDistrictList:
 *   get:
 *     summary: Get a list of all districts in Nepal
 *     tags: [Misc]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getNepalDistrictList', MiscController.getNepalDistrictList);

export default router;
