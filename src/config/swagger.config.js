import swaggerJsdoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mero Uni API",
      version: "1.0.0",
      description: "API documentation for Mero Uni platform",
      contact: {
        name: "API Support",
        email: "[EMAIL_ADDRESS]",
      },
      license: {
        name: "ISC",
      },
    },
    servers: [
      {
        url:
          process.env.API_BASE_URL ||
          `http://localhost:${process.env.PORT || 8888}${
            process.env.VERSION || "/api/v1"
          }`,
        description: "Development server",
      },
      {
        url: "https://api.merouni.com/api/v1",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "refreshToken",
          description: "Refresh token stored in cookie",
        },
      },
    },
    tags: [
      { name: "Health", description: "Health check endpoints" },
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Users", description: "User management endpoints" },
      { name: "Colleges", description: "College management endpoints" },
      { name: "Universities", description: "University management endpoints" },
      { name: "Courses", description: "Course management endpoints" },
      { name: "Programs", description: "Program management endpoints" },
      { name: "Events", description: "Event management endpoints" },
      { name: "News", description: "News/Blog management endpoints" },
      { name: "Careers", description: "Career management endpoints" },
      { name: "Materials", description: "Material management endpoints" },
      { name: "Banners", description: "Banner management endpoints" },
      { name: "Categories", description: "Category management endpoints" },
      { name: "Scholarships", description: "Scholarship management endpoints" },
      { name: "Exams", description: "Exam management endpoints" },
      { name: "Referrals", description: "Referral management endpoints" },
      { name: "Wishlist", description: "Wishlist management endpoints" },
      { name: "Analytics", description: "Analytics endpoints" },
    ],
  },
  apis: [join(__dirname, "../routes/*.js"), join(__dirname, "../index.js")],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
