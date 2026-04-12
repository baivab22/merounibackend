// import library function
import express from "express";

// instance for route of express
const router = express.Router();

import activityTracker from "../middlewares/ActivityTracker.middleware.js";
router.use(activityTracker);

import contactRoute from "./Contact.route.js";
router.use("/contact-us", contactRoute);

import newsletterRoute from "./Newsletter.route.js";
router.use("/newsletter", newsletterRoute);

import HomeController from "../controllers/home/Home.controller.js";
/**
 * @swagger
 * /search:
 *   get:
 *     summary: Global search across all resources
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results across colleges, universities, programs, events, news, etc.
 *       500:
 *         description: Server error
 */
router.get("/search", HomeController.search);

/**
 * @swagger
 * /popular-searches:
 *   get:
 *     summary: Get popular search terms
 *     tags: [Search]
 *     responses:
 *       200:
 *         description: List of popular search terms
 *       500:
 *         description: Server error
 */
router.get("/popular-searches", HomeController.getPopularSearches);

// import user-defined components
import userRoute from "./User.route.js";
router.use("/users", userRoute);

import consultancyRoute from "./consultancy/Consultancy.route.js";
router.use("/consultancy", consultancyRoute);

import categoryRoute from "./Category.route.js";
router.use("/category", categoryRoute);
router.use("/categories", categoryRoute);

import tagRoute from "./Tag.route.js";
router.use("/tag", tagRoute);

import blogRoute from "./Blog.route.js";
router.use("/blogs", blogRoute);

import newsRoute from "./News.route.js";
router.use("/news", newsRoute);

import levelRoute from "./Level.route.js";
router.use("/level", levelRoute);

import facultyRoute from "./Faculty.route.js";
router.use("/faculty", facultyRoute);

import materialRoute from "./Material.route.js";
router.use("/materials", materialRoute);

import scholarshipRoute from "./Scholarship.route.js";
router.use("/scholarship", scholarshipRoute);

import scholarshipApplicationRoute from "./ScholarshipApplication.route.js";
router.use("/scholarship-application", scholarshipApplicationRoute);

import universityRoute from "./University.route.js";
router.use("/university", universityRoute);

import coursesRoute from "./Course.route.js";
router.use("/course", coursesRoute);

import programRoute from "./Program.route.js";
router.use("/program", programRoute);

import examRoute from "./Exam.route.js";
router.use("/exam", examRoute);

import collegeRoute from "./College.route.js";
router.use("/college", collegeRoute);

import collegeRankingRoute from "./CollegeRanking.route.js";
router.use("/college-ranking", collegeRankingRoute);

import eventRoute from "./Event.route.js";
router.use("/event", eventRoute);

import bannerRoute from "./Banner.route.js";
router.use("/banner", bannerRoute);

import wishlistRoute from "./Wishlist.route.js";
router.use("/wishlist", wishlistRoute);

import referralRoute from "./Referral.route.js";
router.use("/referral", referralRoute);

import careerRoute from "./Career.route.js";
router.use("/career", careerRoute);

import vacancyRoute from "./Vacancy.route.js";
router.use("/vacancy", vacancyRoute);

import schoolRoute from "./School.route.js";
router.use("/school", schoolRoute);

import authRoute from "./Auth.route.js";
router.use("/auth", authRoute);

import analyticsRoute from "./Analytics.route.js";
router.use("/analytics", analyticsRoute);

import configRoute from "./Config.route.js";
router.use("/config", configRoute);

import skillsBasedCourseRoute from "./SkillsBasedCourse.route.js";
router.use("/skills-based-courses", skillsBasedCourseRoute);

import disciplineRoute from "./Discipline.route.js";
router.use("/discipline", disciplineRoute);

import videoRoute from "./Video.route.js";
router.use("/video", videoRoute);

import degreeRoute from "./Degree.route.js";
router.use("/degree", degreeRoute);

import boardRoute from "./Board.route.js";
router.use("/board", boardRoute);

import streamRoute from "./Stream.route.js";
router.use("/stream", streamRoute);


import consultancyApplicationRoute from "./consultancy/ConsultancyApplication.route.js";
router.use("/consultancy-application", consultancyApplicationRoute);

import databaseRoute from "./Database.route.js";
router.use("/database", databaseRoute);

import activityLogRoute from "./ActivityLog.route.js";
router.use("/activity-logs", activityLogRoute);

import miscRoute from "./Misc.route.js";
router.use("/misc", miscRoute);

export default router;

