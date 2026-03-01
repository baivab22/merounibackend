import * as yup from "yup";
import { paginationSchema, idQuerySchema } from "../common/common.validator.js";

export { paginationSchema, idQuerySchema };

export const universitySlugParamSchema = yup.object({
  slug: yup.string().trim().required(),
});

export const universityListSchema = paginationSchema.shape({
  type: yup.string().oneOf(["Public", "Private"]).optional(),
  status: yup.string().oneOf(["published", "draft"]).optional(),
});

// Create/Update University schema - adjust based on actual requirements
export const createOrUpdateUniversitySchema = yup
  .object({
    id: yup.number().integer().positive().optional(),
    fullname: yup.string().trim().required("University name is required"),
    country: yup.string().trim().optional(),
    state: yup.string().trim().optional(),
    city: yup.string().trim().optional(),
    street: yup.string().trim().optional(),
    postal_code: yup.string().trim().optional(),
    date_of_establish: yup
      .number()
      .integer()
      .min(1000, "Year must be exactly 4 digits (1000-9999)")
      .max(9999, "Year must be exactly 4 digits (1000-9999)")
      .nullable()
      .optional(),
    type_of_institute: yup.string().oneOf(["Public", "Private"]).optional(),
    description: yup.string().nullable().optional(),
    author_id: yup.number().integer().positive().optional(),
    contact: yup
      .object({
        faxes: yup.string().nullable().optional(),
        poboxes: yup.string().nullable().optional(),
        email: yup.string().email().nullable().optional(),
        phone_number: yup.string().nullable().optional(),
        website_url: yup
          .string()
          .nullable()
          .optional()
          .test("url", "Invalid URL format", (v) => !v || /^https?:\/\/.+/.test(v)),
      })
      .nullable()
      .optional(),
    levels: yup.array().of(yup.number().integer().positive()).optional(),
    programs: yup.array().of(yup.number().integer().positive()).optional(),
    members: yup.array().optional(),
    logo: yup.string().nullable().optional(),
    featured_image: yup.string().nullable().optional(),
    videos: yup.mixed().nullable().optional(),
    map: yup.string().required("Map is required"),
    gallery: yup.array().of(yup.string()).optional(),
  })
  .test("has-fields", "At least one field must be provided", (value) => {
    if (value && value.id) return true; // Update case
    return true; // Adjust based on actual requirements
  });

// Schema for saving as draft - only fullname is required
export const draftUniversitySchema = createOrUpdateUniversitySchema.shape({
  fullname: yup.string().trim().required("University name is required"),
  map: yup.string().optional(), // Map is optional for drafts
});

export const deleteUniversityQuerySchema = idQuerySchema;
