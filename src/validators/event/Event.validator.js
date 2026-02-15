import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema };

export const eventListAllQuerySchema = yup.object({
  college_id: yup.number().integer().positive().optional(),
  q: yup.string().trim().optional(),
  is_featured: yup.number().integer().min(0).max(1).optional().default(0),
  page: yup.number().integer().positive().optional().default(1),
  limit: yup.number().integer().positive().optional().default(10),
  sort: yup.string().optional().default("asc"),
});
export const eventSlugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

export const deleteEventQuerySchema = yup.object({
  event_id: yup.number().integer().positive().required(),
});

// Event host schema
const eventHostSchema = yup.object({
  host: yup.string().transform((value) => value?.trim()).required("Host is required"),
  start_date: yup.string().required("Start date is required"),
  end_date: yup.string().required("End date is required"),
  time: yup.string().optional(),
  location: yup.string().optional(),
  map_url: yup.string().optional(),
});

// Create/Update Event schema
export const createOrUpdateEventSchema = yup
  .object({
    id: yup.number().integer().positive().optional(),
    title: yup
      .string()
      .trim()
      .when("id", {
        is: (id) => !id, // Create case
        then: (schema) => schema.required("Title is required"),
        otherwise: (schema) => schema.optional(),
      }),
    description: yup.string().trim().optional(),
    content: yup
      .string()
      .trim()
      .when("id", {
        is: (id) => !id, // Create case
        then: (schema) => schema.required("Content is required"),
        otherwise: (schema) => schema.optional(),
      }),
    image: yup
      .string()
      .trim()
      .when("id", {
        is: (id) => !id, // Create case
        then: (schema) => schema.required("Image is required"),
        otherwise: (schema) => schema.optional(),
      }),
    category_id: yup
      .number()
      .integer()
      .positive()
      .when("id", {
        is: (id) => !id, // Create case
        then: (schema) => schema.required("Category ID is required"),
        otherwise: (schema) => schema.optional(),
      }),
    college_id: yup
      .number()
      .integer()
      .positive()
      .nullable()
      .transform((value, originalValue) => {
        // Transform empty strings to null
        if (
          originalValue === "" ||
          originalValue === null ||
          originalValue === undefined
        ) {
          return null;
        }
        return value;
      })
      .optional(),
    author_id: yup
      .number()
      .integer()
      .positive()
      .when("id", {
        is: (id) => !id, // Create case
        then: (schema) => schema.required("Author ID is required"),
        otherwise: (schema) => schema.optional(),
      }),
    is_featured: yup.number().integer().min(0).max(1).optional().default(0),
    event_host: yup
      .mixed()
      .test("is-object", "Event host must be an object", (value) => {
        if (value === undefined || value === null) {
          // Allow null/undefined only in update case (checked by when condition)
          return true;
        }
        return typeof value === "object" && !Array.isArray(value);
      })
      .when("id", {
        is: (id) => !id, // Create case
        then: (schema) =>
          schema
            .required("Event host is required")
            .test(
              "valid-host",
              "Invalid event host structure",
              function (value) {
                if (!value)
                  return this.createError({
                    message: "Event host is required",
                  });
                try {
                  eventHostSchema.validateSync(value, {
                    strict: true,
                    abortEarly: false,
                  });
                  return true;
                } catch (error) {
                  return this.createError({
                    message: error.message || "Invalid event host structure",
                  });
                }
              }
            ),
        otherwise: (schema) =>
          schema
            .optional()
            .test(
              "valid-host",
              "Invalid event host structure",
              function (value) {
                if (value === undefined || value === null) return true;
                try {
                  eventHostSchema.validateSync(value, {
                    strict: true,
                    abortEarly: false,
                  });
                  return true;
                } catch (error) {
                  return this.createError({
                    message: error.message || "Invalid event host structure",
                  });
                }
              }
            ),
      }),
  })
  .test("has-fields", "At least one field must be provided", (value) => {
    if (value && value.id) {
      // Update case: at least one field besides id must be provided
      const { id, ...otherFields } = value;
      return Object.keys(otherFields).length > 0;
    }
    // Create case: required fields are already validated above
    return true;
  });
