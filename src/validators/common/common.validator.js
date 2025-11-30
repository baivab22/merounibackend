import * as yup from "yup";

// Shared pagination schema
export const paginationSchema = yup.object({
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(100).default(10),
  sort: yup
    .string()
    .oneOf(["ASC", "DESC", "asc", "desc"])
    .transform((value) => (value ? value.toUpperCase() : "ASC"))
    .default("ASC"),
  q: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

// Common ID param schema
export const idParamSchema = yup.object({
  id: yup.number().integer().positive().required(),
});

// Common ID query schema
export const idQuerySchema = yup.object({
  id: yup.number().integer().positive().required(),
});

// Slug param schema
export const slugParamSchema = yup.object({
  slug: yup.string().trim().required(),
  slugs: yup.string().trim().required(),
});
