import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
  idParamSchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema, idParamSchema };

export const examSlugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

export const examIdParamSchema = yup.object({
  id: yup.number().integer().positive().required(),
});

// Create/Update Exam schema - adjust fields based on actual requirements
export const createOrUpdateExamSchema = yup
  .object({
    id: yup.number().integer().positive().optional(),
    // Add other required fields based on your Exam model
  })
  .test("has-fields", "At least one field must be provided", (value) => {
    if (value && value.id) return true; // Update case
    // Add validation for create case - ensure required fields exist
    return true; // Adjust based on actual requirements
  });
