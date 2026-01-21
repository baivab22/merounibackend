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
export const createOrUpdateCourseSchema = yup.object({
  id: yup.number().integer().positive().optional(),
  title: yup
    .string()
    .trim()
    .when("id", {
      is: (id) => !id,
      then: (schema) =>
        schema.required("Title is required for creating a course"),
      otherwise: (schema) => schema.optional(),
    }),
  code: yup.string().trim().optional(),
  duration: yup.number().positive().optional(),
  credits: yup.number().positive().optional(),
  authorId: yup.number().integer().positive().optional(),
  facultyId: yup.number().integer().positive().optional(),
  description: yup.string().trim().optional(),
  syllabus: yup.array().of(yup.string().trim()).optional(),
});

export const deleteCourseQuerySchema = idQuerySchema;
