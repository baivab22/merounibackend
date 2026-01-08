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
    name: yup.string().required("Name is required"),
    description: yup.string(),
    eligibilityCriteria: yup.string(),
    amount: yup.number().positive(),
    applicationDeadline: yup.string(),
    author: yup.number().integer().positive(),
    renewalCriteria: yup.string(),
    contactInfo: yup.string(),
    title: yup.string(), // Optional, for backward compatibility
  })
  .required();

export const updateScholarshipQuerySchema = yup.object({
  scholarship_id: yup.number().integer().positive().required(),
});

export const updateScholarshipBodySchema = yup
  .object({
    name: yup.string(),
    description: yup.string(),
    eligibilityCriteria: yup.string(),
    amount: yup.number().positive(),
    applicationDeadline: yup.string(),
    renewalCriteria: yup.string(),
    contactInfo: yup.string(),
    title: yup.string(), // Optional, for backward compatibility
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const deleteScholarshipQuerySchema = yup.object({
  scholarship_id: yup.number().integer().positive().required(),
});
