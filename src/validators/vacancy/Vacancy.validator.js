import * as yup from "yup";

export const paginationSchema = yup.object({
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(100).default(24),
  sort: yup
    .string()
    .oneOf(["ASC", "DESC", "asc", "desc"])
    .transform((value) => (value ? value.toUpperCase() : "DESC"))
    .default("DESC"),
  q: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  status: yup
    .string()
    .oneOf(["published", "draft"])
    .nullable()
    .optional()
    .transform((value) => (value === "" ? null : value)),
});

export const slugParamSchema = yup.object({
  slug: yup.string().trim().required(),
});

export const createVacancySchema = yup
  .object({
    title: yup.string().trim().min(3).required(),
    author_id: yup.number().integer().positive().required(),
    associated_organization_name: yup.string().trim().max(255).nullable(),
    featuredImage: yup.string().trim().nullable(),
    pdf_file: yup.string().trim().nullable(),
    description: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    content: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    status: yup.string().oneOf(["draft", "published"]).optional(),
    slug: yup.string().trim().optional(),
    meta_description: yup.string().trim().optional(),
  })
  .required();

export const updateVacancyQuerySchema = yup.object({
  id: yup.number().integer().positive().required(),
});

export const updateVacancyBodySchema = yup
  .object({
    title: yup.string().trim().min(3),
    author_id: yup.number().integer().positive(),
    associated_organization_name: yup.string().trim().max(255).nullable(),
    featuredImage: yup.string().trim(),
    pdf_file: yup.string().trim().nullable(),
    description: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    content: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    status: yup.string().oneOf(["draft", "published"]).optional(),
    slug: yup.string().trim().optional(),
    meta_description: yup.string().trim().optional(),
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const deleteVacancyQuerySchema = yup.object({
  id: yup.number().integer().positive().required(),
});
