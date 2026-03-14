import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema };

export const categorySlugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

export const categoryListQuerySchema = paginationSchema.shape({
  parent_id: yup.number().integer().positive().nullable().optional(),
  type: yup.string().oneOf(["BLOG", "EVENT", "NEWS", "MATERIAL", "SCHOLARSHIP", "EXAM"]).optional().nullable(),
});

export const createCategorySchema = yup.object({
  title: yup.string().trim().min(1).required("Title is required"),
  description: yup.string().nullable().optional(),
  type: yup.string().oneOf(["BLOG", "EVENT", "NEWS", "MATERIAL", "SCHOLARSHIP", "EXAM"]).optional().nullable(),
  parent_id: yup.number().integer().positive().nullable().optional(),
});

export const updateCategoryQuerySchema = yup.object({
  category_id: yup.number().integer().positive().required(),
});

export const updateCategoryBodySchema = yup
  .object({
    title: yup.string().trim().min(1),
    description: yup.string().nullable(),
    author: yup.number().integer().positive(),
    type: yup.string().oneOf(["BLOG", "EVENT", "NEWS", "MATERIAL", "SCHOLARSHIP", "EXAM"]).optional().nullable(),
    parent_id: yup.number().integer().positive().nullable().optional(),
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const deleteCategoryQuerySchema = yup.object({
  category_id: yup.number().integer().positive().required(),
});
