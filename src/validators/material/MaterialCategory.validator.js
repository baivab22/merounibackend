import * as yup from "yup";
import { paginationSchema, idQuerySchema } from "../common/common.validator.js";

export { paginationSchema };

export const materialCategoryIdParamSchema = yup.object({
  id: yup.string().matches(/^\d+$/, "ID must be a number").required(),
});

export const createMaterialCategorySchema = yup
  .object({
    name: yup.string().min(1, "Name is required").required(),
    description: yup.string().nullable().optional(),
  })
  .required();

export const updateMaterialCategoryQuerySchema = yup.object({
  category_id: yup.number().integer().positive().required(),
});

export const updateMaterialCategoryBodySchema = yup
  .object({
    name: yup.string().min(1).optional(),
    description: yup.string().nullable().optional(),
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const deleteMaterialCategoryQuerySchema = yup.object({
  category_id: yup.number().integer().positive().required(),
});
