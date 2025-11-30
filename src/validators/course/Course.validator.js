import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
  idQuerySchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema, idQuerySchema };

export const courseSlugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

// Create/Update Course schema - adjust fields based on actual requirements
export const createOrUpdateCourseSchema = yup
  .object({
    id: yup.number().integer().positive().optional(),
    // Add other required fields based on your Course model
  })
  .test("has-fields", "At least one field must be provided", (value) => {
    if (value && value.id) return true; // Update case
    // Add validation for create case
    return true; // Adjust based on actual requirements
  });

export const deleteCourseQuerySchema = idQuerySchema;
