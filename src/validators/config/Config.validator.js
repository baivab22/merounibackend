import * as yup from "yup";
import { paginationSchema } from "../common/common.validator.js";

export { paginationSchema };

export const listConfigSchema = paginationSchema.shape({
  types: yup.string().trim().optional(),
});

export const createConfigSchema = yup.object({
  type: yup.string().trim().min(1).max(100).required("Type is required"),
  value: yup.string().trim().optional(),
});

export const updateConfigSchema = yup.object({
  value: yup.string().trim().optional(),
});

export const configTypeParamSchema = yup.object({
  type: yup.string().trim().required(),
});
