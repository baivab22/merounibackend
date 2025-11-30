import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
  idQuerySchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema };

export const levelSlugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

export const createLevelSchema = yup.object({
  title: yup.string().trim().min(1).required("Title is required"),
  author: yup.number().integer().positive().optional(),
});

export const updateLevelQuerySchema = yup.object({
  level_id: yup.number().integer().positive().required(),
});

export const updateLevelBodySchema = yup
  .object({
    title: yup.string().trim().min(1),
    author: yup.number().integer().positive(),
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const deleteLevelQuerySchema = yup.object({
  id: yup.number().integer().positive().required(),
});
