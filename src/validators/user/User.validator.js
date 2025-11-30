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
    // Add fields based on your User model
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
