import nodemailer from "nodemailer";
import envConfig from "../config/env.config.js";

// Configure your transporter
const transporter = nodemailer.createTransport({
  host: envConfig.MAIL_HOST,
  port: envConfig.MAIL_PORT,
  secure: false,
  auth: {
    user: envConfig.MAIL_USER,
    pass: envConfig.MAIL_PASS,
  },
  debug: envConfig.NODE_ENV !== "production",
  logger: envConfig.NODE_ENV !== "production",
});

// Function to send email
export const sendMail = async (to, subject, text, html, attachments = []) => {
  try {
    const info = await transporter.sendMail({
      from: envConfig.MAIL_USER,
      to,
      subject,
      text,
      html,
      attachments,
    });

    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
