import express from "express";

// user controller
import {
  listContacts,
  listContact,
} from "../controller/GetContactController.js";
import { addContactController } from "../controller/AddContactController.js";
import { deleteContact } from "../controller/DeleteContactController.js";
// import { updateBlog } from "../controllers/UpdateNews.js";

// authorized middleware
import { authenticateUser } from "../../../middleware/AuthMiddleware.js";
import { authorizeRole } from "../../../middleware/AuthorizeRole.js";

const route = express.Router();

route
  .get("/", listContacts)
  .get("/:slugs", listContact)
  .post("/")
  .delete(
    "/",
    authenticateUser,
    authorizeRole(["super-admin", "admin"]),
    deleteContact
  );

export default route;
