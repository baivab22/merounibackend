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
});

export const slugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

export const createVacancySchema = yup
  .object({
    title: yup.string().trim().min(3).required(),
    author_id: yup.number().integer().positive().required(),
    featuredImage: yup.string().trim().nullable(),
    description: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    content: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
  })
  .required();

export const updateVacancyQuerySchema = yup.object({
  id: yup.number().integer().positive().required(),
});

export const updateVacancyBodySchema = yup
  .object({
    title: yup.string().trim().min(3),
    author_id: yup.number().integer().positive(),
    featuredImage: yup.string().trim(),
    description: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    content: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
  })
  .test("at-least-one", "At least one field must be provided", (value) => {
    return value && Object.keys(value).length > 0;
  });

export const deleteVacancyQuerySchema = yup.object({
  id: yup.number().integer().positive().required(),
});
