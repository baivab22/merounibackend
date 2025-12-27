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
    fullname: yup.string().trim().optional(),
    country: yup.string().trim().optional(),
    state: yup.string().trim().optional(),
    city: yup.string().trim().optional(),
    street: yup.string().trim().optional(),
    postal_code: yup.string().trim().optional(),
    date_of_establish: yup.date().nullable().optional(),
    type_of_institute: yup.string().oneOf(["Public", "Private"]).optional(),
    description: yup.string().nullable().optional(),
    author_id: yup.number().integer().positive().optional(),
    contact: yup
      .object({
        faxes: yup.string().nullable().optional(),
        poboxes: yup.string().nullable().optional(),
        email: yup.string().email().nullable().optional(),
        phone_number: yup.string().nullable().optional(),
      })
      .nullable()
      .optional(),
    levels: yup.array().of(yup.number().integer().positive()).optional(),
    programs: yup.array().of(yup.number().integer().positive()).optional(),
    members: yup.array().optional(),
    assets: yup
      .object({
        featured_image: yup.string().nullable().optional(),
        videos: yup.string().nullable().optional(),
      })
      .nullable()
      .optional(),
    gallery: yup.array().of(yup.string()).optional(),
  })
  .test("has-fields", "At least one field must be provided", (value) => {
    if (value && value.id) return true; // Update case
    return true; // Adjust based on actual requirements
  });

export const deleteUniversityQuerySchema = idQuerySchema;
