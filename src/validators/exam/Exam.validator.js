import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
  idParamSchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema, idParamSchema };

export const examSlugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

export const examIdParamSchema = yup.object({
  id: yup.number().integer().positive().required(),
});

export const listExamsSchema = paginationSchema.shape({
  levelId: yup.number().integer().positive().optional(),
  universityId: yup.number().integer().positive().optional(),
  categoryId: yup.number().integer().positive().optional(),
  isOpen: yup.boolean().optional(),
  examType: yup.string().optional(),
  isUpcoming: yup.boolean().optional(),
  sortBy: yup
    .string()
    .oneOf(["title", "createdAt"])
    .default("createdAt"),
  sortOrder: yup
    .string()
    .oneOf(["ASC", "DESC", "asc", "desc"])
    .transform((value) => (value ? value.toUpperCase() : "DESC"))
    .default("DESC"),
  status: yup.string().oneOf(["published", "draft"]).optional(),
});

// Create/Update Exam schema - adjust fields based on actual requirements
export const createOrUpdateExamSchema = yup
  .object({
    id: yup.number().integer().positive().nullable().optional(),
    title: yup.string().trim().required("Title is required"),
    description: yup.string().nullable().optional(),
    meta_description: yup.string().nullable().optional(),
    level_id: yup.number().integer().required("Level ID is required"),
    category_id: yup.number()
      .transform((value, originalValue) => originalValue === "" ? null : value)
      .nullable()
      .optional(),
    affiliation: yup
      .array()
      .of(yup.number().integer().positive())
      .nullable()
      .optional()
      .default([]),
    conducted_by: yup.string().nullable().optional(),
    syllabus: yup.string().nullable().optional(),
    pastQuestion: yup
      .array()
      .of(yup.string())
      .nullable()
      .optional()
      .default([]),
    author: yup.number().integer().required("Author is required"),

    // Flattened fields
    exam_type: yup.string().nullable().optional(),
    full_marks: yup.number()
      .transform((value, originalValue) => originalValue === "" ? null : value)
      .nullable()
      .optional(),
    pass_marks: yup.number()
      .transform((value, originalValue) => originalValue === "" ? null : value)
      .nullable()
      .optional(),
    questions_count: yup.number()
      .transform((value, originalValue) => originalValue === "" ? null : value)
      .nullable()
      .optional(),
    question_type: yup.string().nullable().optional(),
    duration: yup.string().nullable().optional(),

    normal_fee: yup.number()
      .transform((value, originalValue) => originalValue === "" ? null : value)
      .nullable()
      .optional(),
    late_fee: yup.number()
      .transform((value, originalValue) => originalValue === "" ? null : value)
      .nullable()
      .optional(),
    exam_date: yup.string()
      .transform((value) => (value === "" || value === "Invalid date" ? null : value))
      .nullable()
      .optional(),
    opening_date: yup.string()
      .transform((value) => (value === "" || value === "Invalid date" ? null : value))
      .nullable()
      .optional(),
    closing_date: yup.string()
      .transform((value) => (value === "" || value === "Invalid date" ? null : value))
      .nullable()
      .optional(),
    status: yup.string().oneOf(["published", "draft"]).default("published").optional(),
  })
  .test("has-fields", "At least one field must be provided", (value) => {
    if (value && (value.title || value.id)) return true;
    return false;
  });
