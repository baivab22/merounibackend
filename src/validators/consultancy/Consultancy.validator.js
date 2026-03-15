import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
  idQuerySchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema, idQuerySchema };

export const listConsultancyQuerySchema = paginationSchema.shape({
  sort: yup
    .string()
    .oneOf(["ASC", "DESC", "asc", "desc"])
    .transform((value) => (value ? value.toUpperCase() : "DESC"))
    .default("DESC"),
  courseId: yup.number().integer().positive().optional(),
  city: yup.string().trim().optional(),
  destination: yup.string().trim().optional(),
});

export const consultancySlugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

// Create/Update Consultancy schema
export const createOrUpdateConsultancySchema = yup.object({
  id: yup.number().integer().positive().optional(),
  title: yup
    .string()
    .trim()
    .when("id", {
      is: (id) => !id, // Required for create
      then: (schema) => schema.required("Title is required"),
      otherwise: (schema) => schema.optional(),
    }),
  destination: yup
    .mixed()
    .nullable()
    .optional()
    .transform((value) => {
      if (value == null) return [];
      if (!Array.isArray(value)) return [];
      return value
        .map((v) =>
          typeof v === "string"
            ? v.trim()
            : v?.country
              ? String(v.country).trim()
              : "",
        )
        .filter(Boolean);
    })
    .default([]),
  address: yup
    .mixed()
    .nullable()
    .optional()
    .test("is-object", "Address must be an object", (value) => {
      if (value === null || value === undefined) return true;
      return typeof value === "object" && !Array.isArray(value);
    }),
  location: yup.string().trim().nullable().optional(),
  featured_image: yup

    .string()
    .url()
    .when("id", {
      is: (id) => !id, // Required for create
      then: (schema) => schema.required("Featured image is required"),
      otherwise: (schema) => schema.optional(),
    }),
  logo: yup
    .mixed()
    .nullable()
    .optional()
    .test("is-url-or-null", "Logo must be a valid URL or null", (value) => {
      if (value === null || value === undefined || value === "") return true;
      if (typeof value === "string") {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      }
      return false;
    }),
  description: yup
    .mixed()
    .nullable()
    .optional()
    .test(
      "is-string-or-null",
      "Description must be a string or null",
      (value) => {
        if (value === null || value === undefined || value === "") return true;
        return typeof value === "string";
      },
    ),
  meta_description: yup.string().nullable().optional(),
  contact: yup.array().of(yup.string()).nullable().optional().default([]),
  website_url: yup
    .string()
    .url("Website URL must be a valid URL")
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .optional(),
  google_map_url: yup
    .mixed()
    .nullable()
    .optional()
    .test(
      "is-string-or-null",
      "Google Map URL must be a string or null",
      (value) => {
        if (value === null || value === undefined || value === "") return true;
        return typeof value === "string";
      },
    ),
  map_type: yup
    .string()
    .oneOf(["embed_map_url", "google_map_url"])
    .optional()
    .default("google_map_url"),
  video_url: yup
    .string()
    .url("Video URL must be a valid URL")
    .nullable()
    .transform((value) => (value === "" ? null : value))
    .optional(),
  pinned: yup.number().integer().min(0).max(1).optional().default(0),
  courses: yup
    .array()
    .of(yup.number().integer().positive())
    .nullable()
    .optional()
    .default([]),
  status: yup
    .string()
    .oneOf(["draft", "published", "archived"])
    .optional()
    .default("published"),
  visibility: yup
    .string()
    .oneOf(["public", "private"])
    .optional()
    .default("public"),
});

export const deleteConsultancyQuerySchema = idQuerySchema;

export const updateConsultancyOrderSchema = yup
  .object({
    consultancies: yup
      .array()
      .of(
        yup.object({
          id: yup.number().integer().positive().required(),
          order_no: yup.number().integer().min(0).required(),
        })
      )
      .min(1)
      .required(),
  })
  .required();
