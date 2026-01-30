import * as yup from "yup";

export const paginationSchema = yup.object({
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(100).default(10),
  sort: yup
    .string()
    .oneOf(["ASC", "DESC", "asc", "desc"])
    .transform((value) => (value ? value.toUpperCase() : "DESC"))
    .default("DESC"),
  q: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

export const slugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

export const createCareerSchema = yup
  .object({
    title: yup.string().trim().min(3).required(),
    author_id: yup.number().integer().positive().required(),
    featuredImage: yup.string().trim().required(),
    status: yup
      .string()
      .oneOf(["active", "inactive"])
      .default("active"),
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

export const updateCareerQuerySchema = yup.object({
  id: yup.number().integer().positive().required(),
});

export const updateCareerBodySchema = yup
  .object({
    title: yup.string().trim().min(3),
    author_id: yup.number().integer().positive(),
    featuredImage: yup.string().trim(),
    status: yup.string().oneOf(["active", "inactive"]),
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

export const deleteCareerQuerySchema = yup.object({
  id: yup.number().integer().positive().required(),
});
