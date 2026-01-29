import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema };

export const createNewsSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().optional(),
  featuredImage: yup.string().optional(),
  author: yup.number().optional(),
  status: yup.string().optional(),
  visibility: yup.string().optional(),
});

export const updateNewsQuerySchema = yup.object({
  id: yup.number().integer().positive().required(),
});

export const updateNewsBodySchema = yup
  .object({
    title: yup.string(),
    description: yup.string(),
    featuredImage: yup.string(),
    author: yup.number(),
    status: yup.string(),
    visibility: yup.string(),
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const deleteNewsQuerySchema = yup.object({
  id: yup.number().integer().positive().required(),
});

export const newsSlugParamSchema = yup.object({
  slug: yup.string().trim().required(),
});
