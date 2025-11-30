import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
  idQuerySchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema };

export const facultySlugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

// Create/Update Faculty schema - adjust based on actual requirements
export const createFacultySchema = yup
  .object({
    // Add required fields based on your Faculty model
  })
  .required();

export const updateFacultyQuerySchema = yup.object({
  faculty_id: yup.number().integer().positive().required(),
});

export const updateFacultyBodySchema = yup
  .object({
    // Add fields based on your Faculty model
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const deleteFacultyQuerySchema = idQuerySchema;
