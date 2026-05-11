import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
  idQuerySchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema };

export const facultySlugParamSchema = yup.object({
  slug: yup.string().trim().required(),
});

// Create/Update Faculty schema - adjust based on actual requirements
export const createFacultySchema = yup.object({
  title: yup.string().trim().min(1).required("Title is required"),
  description: yup.string().trim().optional(),
  featured_image: yup.string().optional(),
  author: yup.number().integer().positive().required("Author is required"),
  slug: yup.string().trim().optional(),
  meta_description: yup.string().trim().optional(),
});

export const updateFacultyQuerySchema = yup.object({
  faculty_id: yup.number().integer().positive().required(),
});

export const updateFacultyBodySchema = yup
  .object({
    title: yup.string().trim().min(1),
    description: yup.string().trim(),
    featured_image: yup.string(),
    slug: yup.string().trim().optional(),
    meta_description: yup.string().trim().optional(),
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const deleteFacultyQuerySchema = idQuerySchema;
