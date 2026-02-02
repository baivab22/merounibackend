import express from "express";
import ConsultancyApplicationController from "../../controllers/consultancy/ConsultancyApplication.controller.js";
import { authenticateUser } from "../../middlewares/Auth.middleware.js";
import { authorizeRole } from "../../middlewares/AuthorizeRole.js";

const router = express.Router();

// Apply to consultancy
router.post(
  "/apply",
  authenticateUser,
  authorizeRole(["admin", "editor","student","agent"]),
  ConsultancyApplicationController.apply
);

// Get all applications (Admin/Editor only)
router.get(
  "/all",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  ConsultancyApplicationController.getAllApplications
);

// Get user's own applications
router.get(
  "/user/applications",
  authenticateUser,
  authorizeRole(["admin", "editor","student","agent"]),
  ConsultancyApplicationController.getUserApplications
);

// Get applications for the logged-in consultancy owner
router.get(
  "/mine",
  authenticateUser,
  authorizeRole(["consultancy"]),
  ConsultancyApplicationController.getConsultancyApplications
);

// Get applications for a specific consultancy (Admin/Editor only)
router.get(
  "/consultancy/:consultancy_id",
  authenticateUser,
  authorizeRole(["admin", "editor", "consultancy"]),
  ConsultancyApplicationController.getConsultancyApplications
);

// Update application status
router.patch(
  "/:id/status",
  authenticateUser,
  authorizeRole(["admin", "editor", "consultancy"]),
  ConsultancyApplicationController.updateStatus
);

export default router;
