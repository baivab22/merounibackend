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

export const galleryIdParamSchema = yup.object({
  galleryId: yup.number().integer().positive().required(),
});

export const createBannerSchema = yup.object({
  collegeId: yup.number().integer().positive().required(),
  website_url: yup.string().url().nullable().optional(),
  display_position: yup.number().integer().min(1).required(),
  priority: yup.number().integer().optional(),
  date_of_expiry: yup.date().required(),
  bannerImage: yup
    .array()
    .of(
      yup.object({
        title: yup.string().required(),
        gallery: yup
          .object({
            small: yup.string().required(),
            medium: yup.string().required(),
            large: yup.string().required(),
          })
          .required(),
        is_featured: yup.number().integer().oneOf([0, 1]).default(0),
      })
    )
    .min(1)
    .required(),
});
