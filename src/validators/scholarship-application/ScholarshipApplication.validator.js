import * as yup from "yup";
import {
  paginationSchema as basePaginationSchema,
  idParamSchema,
} from "../common/common.validator.js";

export { idParamSchema };

export const paginationSchema = basePaginationSchema.shape({
  status: yup.string().oneOf(["PENDING", "APPROVED", "REJECTED"]).optional(),
  scholarshipId: yup.number().integer().positive().optional(),
  studentId: yup.number().integer().positive().optional(),
});

export const applyForScholarshipSchema = yup.object({
  scholarshipId: yup.number().integer().positive().required("Scholarship ID is required"),
  remarks: yup.string().optional(),
  
});

export const updateApplicationStatusSchema = yup.object({
  status: yup
    .string()
    .oneOf(["PENDING", "APPROVED", "REJECTED"], "Invalid status")
    .required("Status is required"),
  remarks: yup.string().optional(),
});
