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
  isOpen: yup.boolean().optional(),
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
});

// Create/Update Exam schema - adjust fields based on actual requirements
export const createOrUpdateExamSchema = yup
  .object({
    id: yup.number().integer().positive().nullable().optional(),
    title: yup.string().trim().required("Title is required"),
    description: yup.string().optional(),
    level_id: yup.number().integer().required("Level ID is required"),
    affiliation: yup.number().integer().optional(),
    syllabus: yup.string().optional(),
    pastQuestion: yup.string().optional(),
    author: yup.number().integer().required("Author is required"),
    examDetails: yup
      .array()
      .of(
        yup.object({
          exam_type: yup.string().optional(),
          full_marks: yup.number().optional(),
          pass_marks: yup.number().optional(),
          number_of_question: yup.number().optional(),
          question_type: yup.string().optional(),
          duration: yup.string().optional(),
        })
      )
      .optional(),
    applicationDetails: yup
      .object({
        normal_fee: yup.number().nullable().optional(),
        late_fee: yup.number().nullable().optional(),
        exam_date: yup.string().optional(),
        opening_date: yup.string().optional(),
        closing_date: yup.string().optional(),
      })
      .optional(),
  })
  .test("has-fields", "At least one field must be provided", (value) => {
    if (value && (value.title || value.id)) return true;
    return false;
  });
