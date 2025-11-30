import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
  idParamSchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema, idParamSchema };

export const collegeSlugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

export const collegeIdParamSchema = yup.object({
  id: yup.number().integer().positive().required(),
});

// Create/Update College schema - this is a complex schema, adjust based on actual requirements
export const createOrUpdateCollegeSchema = yup
  .object({
    // Add required fields based on your College model
    // This is a placeholder - adjust according to your actual College schema
  })
  .required();
