import * as yup from "yup";
import {
  paginationSchema,
  idParamSchema,
  idQuerySchema,
} from "../common/common.validator.js";

export { paginationSchema, idParamSchema, idQuerySchema };

export const materialIdParamSchema = idParamSchema;

export const materialCategoryQuerySchema = yup.object({
  page: yup.number().integer().min(1).default(1).optional(),
  limit: yup.number().integer().min(1).default(10).optional(),
  sort: yup
    .string()
    .oneOf(["ASC", "DESC", "asc", "desc"])
    .transform((value) => (value ? value.toUpperCase() : "ASC"))
    .default("ASC")
    .optional(),
  q: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .optional(),
  search: yup.string().optional(),
  category_id: yup
    .mixed()
    .nullable()
    .optional()
    .test(
      "is-valid-category-id",
      "Category ID must be a number, 'null', or 'unlisted'",
      (value) => {
        if (value === null || value === undefined || value === "") return true;
        if (value === "null" || value === "unlisted") return true;
        const num = parseInt(value, 10);
        return !isNaN(num) && num > 0;
      }
    ),
});

export const createMaterialSchema = yup
  .object({
    title: yup.string().trim().min(3).required("Title is required"),
    category_id: yup.number().integer().positive().nullable().optional(),
    file_url: yup.string().trim().url("File URL must be a valid URL").optional(),
    description: yup.string().trim().nullable().optional(),
  })
  .required();

export const updateMaterialQuerySchema = idQuerySchema;

export const updateMaterialBodySchema = yup
  .object({
    title: yup.string().trim().min(3).optional(),
    category_id: yup.number().integer().positive().nullable().optional(),
    file_url: yup.string().trim().url("File URL must be a valid URL").optional(),
    description: yup.string().trim().nullable().optional(),
  })
  .test("at-least-one", "At least one field must be provided for update", (value) => {
    // Only count keys that are actually present (not just undefined)
    const keys = Object.keys(value || {}).filter(k => value[k] !== undefined);
    return keys.length > 0;
  });

export const deleteMaterialQuerySchema = idQuerySchema;

export const updateCategoryOrderSchema = yup.object({
  context: yup.string().trim().default("MATERIAL").optional(),
  parent_id: yup.number().integer().positive().nullable().optional(),
  positions: yup.array().of(yup.number().integer().positive()).required("Positions (array of IDs) is required"),
}).required();

export const updateMaterialOrderSchema = yup.object({
  parent_id: yup.number().integer().positive().required("Category ID (parent) is required"),
  positions: yup.array().of(yup.number().integer().positive()).required("Positions (array of Material IDs) is required"),
}).required();