import express from "express";

// user controller
import { getAllCourses, getCourse } from "../controllers/ListCourse.js";
import { createCourse } from "../controllers/NewCourse.js";
// import { deleteBlog } from "../controllers/DeleteNews.js";
// import { updateBlog } from "../controllers/UpdateNews.js";

const route = express.Router();

route.get("/", getAllCourses).get("/:slugs", getCourse).post("/", createCourse);
//   .delete("/", deleteBlog)
//   .put("/", updateBlog);

export default route;
