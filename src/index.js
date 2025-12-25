import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

/**
 * import user defined components
 */
import { logger } from "./config/logger.config.js";
import { authenticate } from "./config/database.config.js";
authenticate();

import "./models/events/associations.js";
import "./models/news/associations.js";
import "./models/college/associations.js";
import "./models/career/associations.js";
import "./models/program/associations.js";
import "./models/faculty/associations.js";

const app = express();

// Replacing console.log with winston
console.log = (message) => {
  logger.info(message);
};

// secret file
const PORT = process.env.PORT || 8888;
const version = process.env.VERSION;

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
    "device-id",
    "x-refresh-token",
  ],
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

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
