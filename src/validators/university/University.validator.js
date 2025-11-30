import * as yup from "yup";
import { paginationSchema, idQuerySchema } from "../common/common.validator.js";

export { paginationSchema, idQuerySchema };

export const universitySlugParamSchema = yup.object({
  slug: yup.string().trim().required(),
});

// Create/Update University schema - adjust based on actual requirements
export const createOrUpdateUniversitySchema = yup
  .object({
    id: yup.number().integer().positive().optional(),
    // Add other required fields based on your University model
  })
  .test("has-fields", "At least one field must be provided", (value) => {
    if (value && value.id) return true; // Update case
    return true; // Adjust based on actual requirements
  });

export const deleteUniversityQuerySchema = idQuerySchema;
