import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema };

export const createNewsSchema = yup.object({
  title: yup.string().trim().min(3).required("Title is required"),
  category: yup
    .number()
    .integer()
    .positive()
    .nullable()
    .transform((v) => (v === "" || v === undefined ? null : v))
    .optional(),
  author: yup.number().integer().positive().required("Author is required"),
  description: yup.string().trim().nullable(),
  meta_description: yup.string().trim().nullable(),
  featured_image: yup.string().trim().required("Featured image is required"),
  college_id: yup.number().integer().positive().nullable(),
  status: yup.string().oneOf(["draft", "published", "archived"]).default("draft"),
});

export const updateNewsParamsSchema = yup.object({
  id: yup.number().integer().positive().required(),
});

export const updateNewsBodySchema = yup
  .object({
    title: yup.string().trim().min(3),
    category: yup.number().integer().positive(),
    author: yup.number().integer().positive(),
    description: yup.string().trim().nullable(),
    meta_description: yup.string().trim().nullable(),
    featured_image: yup.string().trim(),
    college_id: yup.number().integer().positive().nullable(),
    status: yup.string().oneOf(["draft", "published", "archived"]),
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

export const newsIdParamSchema = yup.object({
  id: yup.number().integer().positive().required(),
});
