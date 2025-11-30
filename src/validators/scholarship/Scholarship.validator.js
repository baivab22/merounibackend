import * as yup from "yup";
import {
  paginationSchema,
  idParamSchema,
  idQuerySchema,
} from "../common/common.validator.js";

export { paginationSchema, idParamSchema };

export const scholarshipIdParamSchema = yup.object({
  id: yup.number().integer().positive().required(),
});

// Create/Update Scholarship schema - adjust based on actual requirements
export const createScholarshipSchema = yup
  .object({
    // Add required fields based on your Scholarship model
  })
  .required();

export const updateScholarshipQuerySchema = yup.object({
  scholarship_id: yup.number().integer().positive().required(),
});

export const updateScholarshipBodySchema = yup
  .object({
    // Add fields based on your Scholarship model
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const deleteScholarshipQuerySchema = yup.object({
  scholarship_id: yup.number().integer().positive().required(),
});
