// import library function
import express from "express";

// instance for route of express
const router = express.Router();

// import user-defined components
import userRoute from "../components/users/router/UserRoutes.js";
router.use("/users", userRoute);

import categoryRoute from "../components/category/router/CategoryRoute.js";
router.use("/category", categoryRoute);

import tagRoute from "../components/tags/router/TagRouter.js";
router.use("/tag", tagRoute);

import newsRoute from "../components/news/router/NewsRouter.js";
router.use("/blogs", newsRoute);

import levelRoute from "../components/level/router/LevelRouter.js";
router.use("/level", levelRoute);

import facultyRoute from "../components/faculty/router/FacultyRoute.js";
router.use("/faculty", facultyRoute);

import materialRoute from "../components/materials/router/MaterialRouter.js";
router.use("/material", materialRoute);

import scholarshipRoute from "../components/scholarship/router/ScholarshipRoute.js";
router.use("/scholarship", scholarshipRoute);

import universityRoute from "../components/university/router/UniversityRoute.js";
router.use("/university", universityRoute);

import coursesRoute from "../components/courses/router/CourseRouter.js";
router.use("/course", coursesRoute);

import programRoute from "../components/program/router/ProgramRouter.js";
router.use("/program", programRoute);

import examRoute from "../components/exams/router/ExamRouter.js";
router.use("/exam", examRoute);

import collegeRoute from "../components/college/router/CollegeRouter.js";
router.use("/college", collegeRoute);

import eventRoute from "../components/events/router/EventRouter.js";
router.use("/event", eventRoute);

import bannerRoute from "../components/banner/router/BannerRouter.js";
router.use("/banner", bannerRoute);

import wishlistRoute from "../components/wishlist/router/WishlistRouter.js";
router.use("/wishlist", wishlistRoute);

import referralRoute from "../components/referral/router/ReferralRoute.js";
router.use("/referral", referralRoute);

import careerRoute from "../components/career/router/CareerRouter.js";
router.use("/career", careerRoute);

import authRoute from "../components/authentication/router/AuthRouter.js";
router.use("/auth", authRoute);

export default router;
