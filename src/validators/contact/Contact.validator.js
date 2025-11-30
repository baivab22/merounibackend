import * as yup from "yup";
import { paginationSchema, idQuerySchema } from "../common/common.validator.js";

export { paginationSchema, idQuerySchema };

export const createContactSchema = yup.object({
  fullname: yup.string().required("Fullname is required"),
  email: yup.string().email().required("Email is required"),
  subject: yup.string().required("Subject is required"),
  message: yup.string().optional(),
});

export const contactSlugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

export const contactEmailQuerySchema = yup.object({
  email: yup.string().email().required(),
});
