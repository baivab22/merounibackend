import express from "express";

import ReferralController from "../controllers/referral/Referral.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";
import { requestValidator } from "../middlewares/RequestValidator.middleware.js";
import {
  createSelfApplicationSchema,
  createReferredApplicationSchema,
  applicationTypeParamSchema,
  collegeIdParamSchema,
  collegeIdAndTypeParamSchema,
} from "../validators/referral/Referral.validator.js";

const router = express.Router();

router.post(
  "/self-apply",
  requestValidator(createSelfApplicationSchema, "body"),
  ReferralController.createSelfApplication
);
router.post(
  "/agent-apply",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor", "agent"]),
  requestValidator(createReferredApplicationSchema, "body"),
  ReferralController.createReferredApplication
);
router.get(
  "/",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor", "agent"]),
  ReferralController.getApplications
);
router.get(
  "/user/referrals",
  authenticateUser,
  ReferralController.getUserReferrals
);
router.get(
  "/type/:type",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "editor", "agent"]),
  requestValidator(applicationTypeParamSchema, "params"),
  ReferralController.getApplicationsByType
);
router.get(
  "/college/:college_id",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "college-admin"]),
  requestValidator(collegeIdParamSchema, "params"),
  ReferralController.getCollegeApplications
);
router.get(
  "/college/:college_id/type/:type",
  authenticateUser,
  authorizeRole(["super-admin", "admin", "college-admin"]),
  requestValidator(collegeIdAndTypeParamSchema, "params"),
  ReferralController.getCollegeApplicationsByType
);

export default router;
