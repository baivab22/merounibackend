import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import envConfig from "./config/env.config.js";


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

app.listen(PORT, () => {
  console.log(`Server is Running at: ${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  process.exit(0);
});
