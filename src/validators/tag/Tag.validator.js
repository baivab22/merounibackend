import * as yup from "yup";
import { paginationSchema, idQuerySchema } from "../common/common.validator.js";

export { paginationSchema };

export const tagIdParamSchema = yup.object({
  tag_id: yup.number().integer().positive().required(),
});

export const createTagSchema = yup.object({
  title: yup.string().trim().min(1).required("Title is required"),
  author: yup.number().integer().positive().optional(),
});

export const updateTagQuerySchema = yup.object({
  tag_id: yup.number().integer().positive().required(),
});

export const updateTagBodySchema = yup
  .object({
    title: yup.string().trim().min(1),
    author: yup.number().integer().positive(),
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const deleteTagQuerySchema = yup.object({
  tag_id: yup.number().integer().positive().required(),
});
