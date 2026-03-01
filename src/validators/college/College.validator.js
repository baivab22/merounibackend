import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
  idParamSchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema, idParamSchema };

export const collegePaginationSchema = yup.object({
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(1000).default(10),
  sort: yup
    .string()
    .oneOf(["ASC", "DESC", "asc", "desc"])
    .transform((value) => (value ? value.toUpperCase() : "ASC"))
    .default("ASC"),
  q: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  status: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});

// Shared pagination schema
export const schoolPaginationSchema = yup.object({
  page: yup.number().integer().min(1).default(1),
  limit: yup.number().integer().min(1).max(1000).default(10),
  sort: yup
    .string()
    .oneOf(["ASC", "DESC", "asc", "desc"])
    .transform((value) => (value ? value.toUpperCase() : "ASC"))
    .default("ASC"),
  q: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  type: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
  affiliation: yup
    .string()
    .nullable()
    .transform((value) => (value === "" ? null : value)),
});
export const collegeSlugParamSchema = yup.object({
  slugs: yup.string().trim().required(),
});

export const collegeIdParamSchema = yup.object({
  id: yup.number().integer().positive().required(),
});

// Create/Update College schema
export const createOrUpdateCollegeSchema = yup
  .object({
    id: yup.number().integer().positive().optional(),
    name: yup.string().trim().optional(),
    institute_type: yup
      .string()
      .oneOf(["Public", "Private", "Community", "Technical"])
      .optional(),
    institute_level: yup.array().optional(),
    author_id: yup.number().integer().positive().optional(),
    university_id: yup.array().of(yup.number().integer().positive()).optional(),
    google_map_url: yup.string().optional(),

    map_type: yup.string().optional(),
    website_url: yup
      .string()
      .test("is-valid-url", "website_url must be a valid URL", (value) => {
        if (!value || value.trim() === "") return true;
        const trimmedValue = value.trim();
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+\.)+[a-z]{2,}(\/.*)?$/i;
        return urlPattern.test(trimmedValue);
      })
      .nullable()
      .optional(),
    featured_img: yup.string().nullable().optional(),
    college_logo: yup.string().nullable().optional(),
    college_broucher: yup.string().nullable().optional(),
    description: yup.string().nullable().optional(),
    content: yup.string().nullable().optional(),
    faqs: yup.array().of(yup.object({
      question: yup.string().nullable().optional(),
      answer: yup.string().nullable().optional(),
    })).optional(),
    address: yup
      .object({
        country: yup.string().nullable().optional(),
        state: yup.string().nullable().optional(),
        city: yup.string().nullable().optional(),
        street: yup.string().nullable().optional(),
        postal_code: yup.string().nullable().optional(),
      })
      .nullable()
      .optional(),
    contacts: yup.array().of(yup.string().nullable()).optional(),
    degrees: yup.array().of(yup.number().integer().positive()).optional(),
    programs: yup.array().of(yup.number().integer().positive()).optional(),
    facilities: yup
      .array()
      .of(
        yup.object({
          title: yup.string().nullable().optional(),
          description: yup.string().nullable().optional(),
          icon: yup.string().nullable().optional(),
        })
      )
      .optional(),
    members: yup
      .array()
      .of(
        yup.object({
          name: yup.string().nullable().optional(),
          contact_number: yup.string().nullable().optional(),
          image_url: yup.string().nullable().optional(),
          role: yup
            .string()
            .oneOf(["Principal", "Professor", "Lecturer", "Admin", "Staff"])
            .nullable()
            .optional(),
          description: yup.string().nullable().optional(),
        })
      )
      .optional(),
    admissions: yup
      .array()
      .of(
        yup.object({
          program_id: yup.number().integer().positive().optional(),
          eligibility_criteria: yup.string().nullable().optional(),
          admission_process: yup.string().nullable().optional(),
          fee_details: yup.string().nullable().optional(),
          description: yup.string().nullable().optional(),
        })
      )
      .optional(),
    images: yup
      .array()
      .of(
        yup.object({
          file_type: yup.string().nullable().optional(),
          url: yup.string().nullable().optional(),
        })
      )
      .optional(),
    status: yup
      .string()
      .oneOf(["draft", "published", "archived"])
      .optional()
      .default("published"),
  })
  .required();

export const createOrUpdateAdmissionSchema = yup.object({
  id: yup.number().integer().positive().optional(),
  college_id: yup.number().integer().positive().required(),
  program_id: yup.number().integer().positive().required(),
  eligibility_criteria: yup.string().nullable().optional(),
  admission_process: yup.string().nullable().optional(),
  fee_details: yup.string().nullable().optional(),
  description: yup.string().nullable().optional(),
}).required();

export const updateCollegeOrderSchema = yup
  .object({
    colleges: yup
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

export const updateSchoolOrderSchema = yup
  .object({
    schools: yup
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



export const admissionPaginationSchema = yup
  .object({
    page: yup.number().integer().min(1).default(1),
    limit: yup.number().integer().min(1).max(1000).default(10),
    sort: yup
      .string()
      .oneOf(["ASC", "DESC", "asc", "desc"])
      .transform((value) => (value ? value.toUpperCase() : "ASC"))
      .default("ASC"),
    q: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    program_id: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    course_id: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    level_id: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
    university_id: yup
      .string()
      .nullable()
      .transform((value) => (value === "" ? null : value)),
  });