import nodemailer from "nodemailer";
import envConfig from "../config/env.config.js";

// Configure your transporter
const transporter = nodemailer.createTransport({
  host: envConfig.MAIL_HOST,
  port: envConfig.MAIL_PORT,
  secure: envConfig.MAIL_SECURE,
  auth: {
    user: envConfig.MAIL_USER,
    pass: envConfig.MAIL_PASS,
  },
  debug: envConfig.NODE_ENV !== "production",
  logger: envConfig.NODE_ENV !== "production",
});

// Function to send email
export const sendMail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: envConfig.MAIL_FROM,
      to,
      subject,
      text,
      html,
    });

    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
