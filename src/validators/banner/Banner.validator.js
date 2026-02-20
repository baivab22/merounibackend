import * as yup from "yup";

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
  filter: yup.string().oneOf(["active", "inactive", "all"]).optional(),
});

export const bannerIdParamSchema = yup.object({
  id: yup.number().integer().positive().required(),
});

export const createBannerSchema = yup.object({
  website_url: yup.string().url().nullable().optional(),
  display_position: yup.string().required(),
  priority: yup.number().integer().optional(),
  date_of_expiry: yup.date().optional(),
  title: yup.string().required(),
  banner_image: yup.string().required(),
  is_featured: yup.number().integer().oneOf([0, 1]).default(0),
});
export const updateBannerSchema = yup.object({
  college_id: yup.number().integer().positive().nullable().optional(),
  website_url: yup.string().url().nullable().optional(),
  display_position: yup.number().integer().min(1).optional(),
  priority: yup.number().integer().optional(),
  date_of_expiry: yup.date().optional(),
  title: yup.string().optional(),
  banner_image: yup.string().optional(),
  is_featured: yup.number().integer().oneOf([0, 1]).optional(),
});
