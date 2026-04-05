import express from "express";
import StreamController from "../controllers/stream/Stream.controller.js";
import { authenticateUser } from "../middlewares/Auth.middleware.js";
import { authorizeRole } from "../middlewares/AuthorizeRole.js";


const router = express.Router();

router.get("/", StreamController.listStreams);
router.get("/:id", StreamController.getStream);

router.post(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  StreamController.createStream
);

router.patch(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  StreamController.updateStream
);

router.delete(
  "/",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  StreamController.deleteStream
);

router.post(
  "/:streamId/programs",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  StreamController.linkPrograms
);

router.delete(
  "/:streamId/programs/:programId",
  authenticateUser,
  authorizeRole(["admin", "editor"]),
  StreamController.unlinkProgram
);


export default router;
