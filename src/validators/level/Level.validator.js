import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
  idQuerySchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema };

export const levelSlugParamSchema = yup.object({
  slug: yup.string().trim().required(),
});

export const createLevelSchema = yup.object({
  title: yup.string().trim().min(1).required("Title is required"),
  author: yup.number().integer().positive().optional(),
  slug: yup.string().trim().optional(),
  meta_description: yup.string().trim().optional(),
});

export const updateLevelQuerySchema = yup.object({
  level_id: yup.number().integer().positive().required(),
});

export const updateLevelBodySchema = yup
  .object({
    title: yup.string().trim().min(1),
    author: yup.number().integer().positive(),
    slug: yup.string().trim().optional(),
    meta_description: yup.string().trim().optional(),
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const deleteLevelQuerySchema = yup.object({
  id: yup.number().integer().positive().required(),
});
