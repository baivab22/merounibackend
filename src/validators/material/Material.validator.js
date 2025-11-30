import * as yup from "yup";
import {
  paginationSchema,
  idParamSchema,
  idQuerySchema,
} from "../common/common.validator.js";

export { paginationSchema, idParamSchema, idQuerySchema };

export const materialIdParamSchema = idParamSchema;

// Create/Update Material schema - adjust based on actual requirements
export const createMaterialSchema = yup
  .object({
    // Add required fields based on your Material model
  })
  .required();

export const updateMaterialQuerySchema = idQuerySchema;

export const updateMaterialBodySchema = yup
  .object({
    // Add fields based on your Material model
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const deleteMaterialQuerySchema = idQuerySchema;
