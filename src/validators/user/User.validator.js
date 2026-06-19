import * as yup from "yup";
import { paginationSchema, idQuerySchema } from "../common/common.validator.js";

export { paginationSchema, idQuerySchema };

export const getUserProfileQuerySchema = yup.object({
  id: yup.number().integer().positive().optional(),
});

export const exportUsersQuerySchema = paginationSchema.shape({
  start_date: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
  end_date: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
  role: yup
    .string()
    .nullable()
    .transform((value) => {
      if (!value || value === "" || value.toLowerCase() === "all") {
        return undefined;
      }
      return value.toLowerCase();
    })
    .optional(),
});

// Schema for listing users with role filter
export const listUsersQuerySchema = paginationSchema.shape({
  sort: yup
    .string()
    .oneOf(["ASC", "DESC", "asc", "desc"])
    .transform((value) => (value ? value.toUpperCase() : "DESC"))
    .default("DESC"),
  role: yup
    .string()
    .oneOf([
      "student",
      "editor",
      "admin",
      "agent",
      "institution",
      "consultancy",
    ])
    .optional(),
});

export const deleteUserBodySchema = yup.object({
  user_id: yup.number().integer().positive().required(),
});

export const updateUserProfileQuerySchema = yup.object({
  user_id: yup.number().integer().positive().required(),
});

export const updateUserProfileBodySchema = yup
  .object({
    firstName: yup.string().trim().min(2),
    middleName: yup.string().trim().nullable(),
    lastName: yup.string().trim().min(2),
    email: yup.string().email().trim(),
    phoneNo: yup.string().trim(),
    password: yup.string().min(6),
    roles: yup.object().shape({
      admin: yup.boolean(),
      agent: yup.boolean(),
      editor: yup.boolean(),
      student: yup.boolean(),
      institution: yup.boolean(),
      consultancy: yup.boolean(),
    }),
    pendingRoles: yup.mixed(), // optional, handled in service
    profileImageUrl: yup.string().url().nullable().optional(),
    cvUrl: yup.string().url().nullable().optional(),
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const updateUserDetailsBodySchema = yup.object({
  firstName: yup.string().trim().min(2),
  middleName: yup.string().trim().nullable(),
  lastName: yup.string().trim().min(2),
  phoneNo: yup.string().trim(),
  profileImageUrl: yup.string().url().nullable().optional(),
  cvUrl: yup.string().url().nullable().optional(),
});

export const applyForAgentRoleSchema = yup
  .object({
    // Add required fields based on your agent role application
  })
  .required();

export const reviewAgentRequestSchema = yup
  .object({
    action: yup.string().oneOf(["approve", "reject"]).required(),
    user_id: yup.number().integer().positive().required(),
    // Add other required fields
  })
  .required();

export const createCollegeCredentialsSchema = yup
  .object({
    firstName: yup.string().trim().min(2).required(),
    lastName: yup.string().trim().min(2).required(),
    email: yup.string().email().trim().required(),
    password: yup.string().min(6).required(),
    phoneNo: yup.string().trim().required(),
    collegeId: yup.number().integer().positive().nullable().optional(),
  })
  .required();

export const createConsultancyCredentialsSchema = yup
  .object({
    firstName: yup.string().trim().min(2).required(),
    lastName: yup.string().trim().min(2).required(),
    email: yup.string().email().trim().required(),
    password: yup.string().min(6).required(),
    phoneNo: yup.string().trim().required(),
    consultancyId: yup.number().integer().positive().nullable().optional(),
  })
  .required();
