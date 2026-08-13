import * as yup from "yup";
import { paginationSchema, idQuerySchema } from "../common/common.validator.js";

export { paginationSchema, idQuerySchema };

export const listCareerGuidanceSchema = paginationSchema.shape({
  status: yup.string().optional(),
});

export const createCareerGuidanceSchema = yup.object({
  fullname: yup.string().trim().required("Full name is required"),
  email: yup.string().email().optional().nullable(),
  phone: yup.string().trim().required("Phone number is required"),
  desired_course: yup.string().trim().required("Desired course is required"),
});

export const updateCareerGuidanceStatusSchema = yup.object({
  status: yup.string().trim().required("Status is required"),
  comment: yup.string().trim().nullable().optional(),
});
