import * as yup from "yup";
import { paginationSchema, idParamSchema } from "../common/common.validator.js";

export { paginationSchema };

export const degreeSlugParamSchema = yup.object({
  slug: yup.string().trim().required(),
});

export const degreeIdParamSchema = idParamSchema;

export const createDegreeSchema = yup.object({
  cover_image: yup.string().trim().max(500).nullable().optional(),
  short_name: yup.string().trim().min(1).required("Short name is required"),
  title: yup.string().trim().min(1).required("Title is required"),
});

export const updateDegreeSchema = yup
  .object({
    cover_image: yup.string().trim().max(500).nullable().optional(),
    short_name: yup.string().trim().min(1).optional(),
    title: yup.string().trim().min(1).optional(),
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });
