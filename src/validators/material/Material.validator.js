import * as yup from "yup";
import {
  paginationSchema,
  idParamSchema,
  idQuerySchema,
} from "../common/common.validator.js";

export { paginationSchema, idParamSchema, idQuerySchema };

export const materialIdParamSchema = idParamSchema;

// Schema for category filtering - includes pagination and category_id
export const materialCategoryQuerySchema = yup.object({
  page: yup.number().integer().min(1).default(1).optional(),
  limit: yup.number().integer().min(1).max(100).default(10).optional(),
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

// Create/Update Material schema
// Note: file and image are URL strings, not file objects
export const createMaterialSchema = yup
  .object({
    title: yup.string().required("Title is required"),
    category_id: yup.number().integer().positive().nullable().optional(),
    tags: yup.array().of(yup.number().integer().positive()).optional(),
    image: yup
      .mixed()
      .nullable()
      .optional()
      .test(
        "is-url-or-null",
        "Image must be a valid URL string or null",
        (value) => {
          if (value === null || value === undefined) return true;
          if (typeof value === "string") {
            try {
              new URL(value);
              return true;
            } catch {
              return false;
            }
          }
          return false;
        }
      ), // Image URL (string) - optional, can be null
    file: yup.string().url().required("File URL is required"), // File URL (string) - required
  })
  .required();

export const updateMaterialQuerySchema = idQuerySchema;

export const updateMaterialBodySchema = yup
  .object({
    title: yup.string().optional(),
    category_id: yup.number().integer().positive().nullable().optional(),
    tags: yup.array().of(yup.number().integer().positive()).optional(),
    image: yup
      .mixed()
      .nullable()
      .optional()
      .test(
        "is-url-or-null",
        "Image must be a valid URL string or null",
        (value) => {
          if (value === null || value === undefined) return true;
          if (typeof value === "string") {
            try {
              new URL(value);
              return true;
            } catch {
              return false;
            }
          }
          return false;
        }
      ),
    file: yup.string().url().optional(),
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const deleteMaterialQuerySchema = idQuerySchema;
