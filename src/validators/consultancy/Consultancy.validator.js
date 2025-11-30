import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
  idQuerySchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema, idQuerySchema };

export const consultancySlugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

// Create/Update Consultancy schema - adjust based on actual requirements
export const createOrUpdateConsultancySchema = yup
  .object({
    id: yup.number().integer().positive().optional(),
    // Add other required fields based on your Consultancy model
  })
  .test("has-fields", "At least one field must be provided", (value) => {
    if (value && value.id) return true; // Update case
    return true; // Adjust based on actual requirements
  });

export const deleteConsultancyQuerySchema = idQuerySchema;
