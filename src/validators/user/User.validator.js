import * as yup from "yup";
import { paginationSchema, idQuerySchema } from "../common/common.validator.js";

export { paginationSchema, idQuerySchema };

export const getUserProfileQuerySchema = idQuerySchema;

export const exportUsersQuerySchema = paginationSchema;

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
      "super-admin": yup.boolean(),
      admin: yup.boolean(),
      agent: yup.boolean(),
      editor: yup.boolean(),
      student: yup.boolean(),
      "college-admin": yup.boolean(),
    }),
    pendingRoles: yup.mixed(), // optional, handled in service
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
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
