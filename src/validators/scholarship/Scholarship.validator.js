import * as yup from "yup";
import {
  paginationSchema as basePaginationSchema,
  idParamSchema,
  idQuerySchema,
} from "../common/common.validator.js";

export { idParamSchema };

export const paginationSchema = basePaginationSchema.shape({
  category: yup.number().integer().positive().optional(),
  status: yup.string().oneOf(["draft", "published"]).optional(),
});

export const scholarshipIdParamSchema = yup.object({
  id: yup.number().integer().positive().required(),
});

// Create/Update Scholarship schema - adjust based on actual requirements
export const createScholarshipSchema = yup
  .object({
    name: yup.string().required("Name is required"),
    description: yup.string(),
    category: yup.number().integer().positive().optional(),
    eligibilityCriteria: yup.string(),
    amount: yup.string().trim().optional(),
    applicationDeadline: yup.string(),
    author: yup.number().integer().positive(),
    renewalCriteria: yup.string(),
    contactInfo: yup.string(),
    categoryId: yup.number().integer().positive(),
    meta_description: yup.string().optional(),
    status: yup.string().oneOf(["draft", "published"]).optional(),
    featured_image: yup.string().nullable().optional(),
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
    category: yup.number().integer().positive(),
    categoryId: yup.number().integer().positive(),
    eligibilityCriteria: yup.string(),
    amount: yup.string().trim(),
    applicationDeadline: yup.string(),
    renewalCriteria: yup.string(),
    contactInfo: yup.string(),
    meta_description: yup.string().optional(),
    status: yup.string().oneOf(["draft", "published"]).optional(),
    featured_image: yup.string().nullable().optional(),
    title: yup.string(), // Optional, for backward compatibility
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const deleteScholarshipQuerySchema = yup.object({
  scholarship_id: yup.number().integer().positive().required(),
});
