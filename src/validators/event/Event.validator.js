import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema };

export const eventSlugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

export const deleteEventQuerySchema = yup.object({
  event_id: yup.number().integer().positive().required(),
});

// Create/Update Event schema - adjust based on actual requirements
export const createOrUpdateEventSchema = yup
  .object({
    id: yup.number().integer().positive().optional(),
    // Add other required fields based on your Event model
  })
  .test("has-fields", "At least one field must be provided", (value) => {
    if (value && value.id) return true; // Update case
    // Add validation for create case
    return true; // Adjust based on actual requirements
  });
