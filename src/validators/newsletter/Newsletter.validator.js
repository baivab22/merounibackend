import * as yup from "yup";
import { paginationSchema } from "../common/common.validator.js";

export { paginationSchema };

// Create Newsletter schema - adjust based on actual requirements
export const createNewsletterSchema = yup
  .object({
    email: yup.string().email().required("Email is required"),
    // Add other required fields based on your Newsletter model
  })
  .required();
