import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import envConfig from "./config/env.config.js";
import { logger } from "./config/logger.config.js";

// Capture process-level errors
process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`);
  logger.error(error.stack);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

/**
 * import user defined components
 */
import { authenticate } from "./config/database.config.js";
authenticate();

import "./models/blogs/associations.js";
import "./models/career/associations.js";
import "./models/college/associations.js";
import "./models/events/associations.js";
import "./models/faculty/associations.js";
import "./models/news/associations.js";
import "./models/program/associations.js";
import "./models/scholarship/associations.js";
import "./models/vacancy/associations.js";
import "./models/search/SearchTerm.model.js";
import "./models/materials/MaterialHeart.model.js";

const app = express();

const PORT = envConfig.PORT || 8888;
const version = envConfig.VERSION;

// use of middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5000",
  "http://localhost:8888",
  "https://merouni.com",
  "https://www.merouni.com",
];

const corsOptions = {
  credentials: true,
  origin: allowedOrigins,
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Authorization",
    "x-refresh-token",
  ],
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// Swagger setup
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config.js";
import initCrons from "./Cron.loader.js";

// Initialize automated tasks
initCrons();

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Mero Uni API Documentation",
  })
);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is working
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Server is Working
 */
// check health status of the server
app.get("/health", (req, res) => {
  res.send("Server is Working");
});

import apiRouter from "./routes/index.js";
app.use(version || "/api/v1", apiRouter);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`);
  logger.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is Running at: ${PORT}`);
  logger.info(`Server started and listening on port ${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  process.exit(0);
});
