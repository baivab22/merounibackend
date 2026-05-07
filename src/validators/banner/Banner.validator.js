import * as yup from "yup";

export const paginationSchema = yup.object({
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(100).default(24),
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

const optionalTitle = yup
  .string()
  .nullable()
  .optional()
  .transform((value) =>
    value === undefined || value === null || String(value).trim() === ""
      ? null
      : String(value).trim(),
  );

const optionalWebsiteUrl = yup
  .string()
  .nullable()
  .optional()
  .transform((value) =>
    value === undefined || value === null || String(value).trim() === ""
      ? null
      : String(value).trim(),
  )
  .test(
    "optional-url",
    "Must be a valid URL",
    (value) => {
      if (value == null || value === "") return true;
      try {
        const withScheme = /^https?:\/\//i.test(value)
          ? value
          : `https://${value}`;
        new URL(withScheme);
        return true;
      } catch {
        return false;
      }
    },
  );

/** Reject expiry dates before today (calendar day in UTC). */
const dateOfExpiryNotInPast = yup
  .date()
  .optional()
  .nullable()
  .transform((value) =>
    value === "" || value === undefined ? undefined : value,
  )
  .test(
    "expiry-not-in-past",
    "Expiry date cannot be in the past",
    (value) => {
      if (value == null || value === "") return true;
      const d = new Date(value);
      const today = new Date();
      const dDay = Date.UTC(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
      );
      const todayDay = Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate(),
      );
      return dDay >= todayDay;
    },
  );

export const bannerIdParamSchema = yup.object({
  id: yup.number().integer().positive().required(),
});

export const createBannerSchema = yup.object({
  website_url: optionalWebsiteUrl.default(null),
  display_position: yup.string().required(),
  priority: yup.number().integer().optional(),
  date_of_expiry: dateOfExpiryNotInPast,
  title: optionalTitle.default(null),
  banner_image: yup.string().required(),
  is_featured: yup.number().integer().oneOf([0, 1]).default(0),
});
export const updateBannerSchema = yup.object({
  college_id: yup.number().integer().positive().nullable().optional(),
  website_url: optionalWebsiteUrl,
  display_position: yup.number().integer().min(1).optional(),
  priority: yup.number().integer().optional(),
  date_of_expiry: dateOfExpiryNotInPast,
  title: optionalTitle,
  banner_image: yup.string().optional(),
  is_featured: yup.number().integer().oneOf([0, 1]).optional(),
});
