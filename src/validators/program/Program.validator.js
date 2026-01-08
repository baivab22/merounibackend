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
    title: yup.string().when("id", {
      is: (id) => !id,
      then: (schema) => schema.required("Title is required for new programs"),
      otherwise: (schema) => schema.optional(),
    }),
    code: yup.string().when("id", {
      is: (id) => !id,
      then: (schema) => schema.required("Code is required for new programs"),
      otherwise: (schema) => schema.optional(),
    }),
    author: yup
      .number()
      .integer()
      .positive()
      .when("id", {
        is: (id) => !id,
        then: (schema) =>
          schema.required("Author is required for new programs"),
        otherwise: (schema) => schema.optional(),
      }),
    faculty_id: yup
      .number()
      .integer()
      .positive()
      .when("id", {
        is: (id) => !id,
        then: (schema) =>
          schema.required("Faculty ID is required for new programs"),
        otherwise: (schema) => schema.optional(),
      }),
    level_id: yup
      .number()
      .integer()
      .positive()
      .when("id", {
        is: (id) => !id,
        then: (schema) =>
          schema.required("Level ID is required for new programs"),
        otherwise: (schema) => schema.optional(),
      }),
    duration: yup.string().optional(),
    credits: yup.number().integer().positive().optional(),
    language: yup.string().optional(),
    eligibility_criteria: yup.string().optional(),
    fee: yup.string().optional(),
    scholarship_id: yup.number().integer().positive().nullable().optional(),
    curriculum: yup.string().optional(),
    learning_outcomes: yup.string().optional(),
    delivery_type: yup
      .string()
      .oneOf(["Full-time", "Part-time", "Online", "Hybrid"])
      .optional(),
    delivery_mode: yup
      .string()
      .oneOf(["On-campus", "Remote", "Blended"])
      .optional(),
    careers: yup.string().optional(),
    exam_id: yup.number().integer().positive().nullable().optional(),
    syllabus: yup
      .array()
      .of(
        yup.object({
          year: yup.number().integer().positive().required(),
          semester: yup
            .number()
            .integer()
            .min(0, "Semester must be 0 or greater")
            .required(),
          course_id: yup
            .mixed()
            .nullable()
            .transform((value, originalValue) => {
              // Convert empty string to null
              if (value === "" || value === null || value === undefined) {
                return null;
              }
              // Convert string numbers to actual numbers
              const num = Number(value);
              return isNaN(num) ? null : num;
            })
            .test(
              "is-valid-course-id",
              "course_id must be a positive number or null",
              (value) => {
                if (value === null || value === undefined) return true;
                return Number.isInteger(value) && value > 0;
              }
            )
            .optional(),
          is_elective: yup.boolean().optional(),
        })
      )
      .optional(),
    colleges: yup.array().of(yup.number().integer().positive()).optional(),
  })
  .test("has-fields", "At least one field must be provided", (value) => {
    if (value && value.id) return true; // Update case
    // For create case, required fields are validated above
    return true;
  });
