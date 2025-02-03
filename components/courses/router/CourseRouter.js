import express from "express";

// user controller
import { getAllCourses, getCourseById } from "../controllers/ListCourse.js";
import { createCourse } from "../controllers/NewCourse.js";
// import { deleteBlog } from "../controllers/DeleteNews.js";
// import { updateBlog } from "../controllers/UpdateNews.js";

const route = express.Router();

route.get("/", getAllCourses).get("/", getCourseById).post("/", createCourse);
//   .delete("/", deleteBlog)
//   .put("/", updateBlog);

export default route;
