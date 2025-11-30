import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
  idParamSchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema, idParamSchema };

export const programSlugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

export const programIdParamSchema = yup.object({
  id: yup.number().integer().positive().required(),
});

// Create/Update Program schema - adjust fields based on actual requirements
export const createOrUpdateProgramSchema = yup
  .object({
    id: yup.number().integer().positive().optional(),
    // Add other required fields based on your Program model
  })
  .test("has-fields", "At least one field must be provided", (value) => {
    if (value && value.id) return true; // Update case
    // Add validation for create case
    return true; // Adjust based on actual requirements
  });
