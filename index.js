import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

/**
 * import user defined components
 */
import {authenticate} from "./config/database.js";
authenticate();

import "./components/events/model/associations.js";
import "./components/news/model/associations.js";

const app = express();

// secret file
const PORT = process.env.PORT || 8888;
const version = process.env.VERSION;

// use of middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5000",
  "http://localhost:8888",
];

const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  allowedHeader: [
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

// import homeRoute from "./src/routes/home_routes.js";
// app.use("/", homeRoute);

// // import routing for api-server
import apiRouter from "./routes/api_routes.js";
app.use(version, apiRouter);

app.listen(PORT, () => {
  console.log(`Server is Running at: ${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...");
  process.exit(0);
});
