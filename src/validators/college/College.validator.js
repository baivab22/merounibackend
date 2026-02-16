import * as yup from "yup";
import {
  paginationSchema,
  slugParamSchema,
  idParamSchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema, idParamSchema };

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
    university_id: yup.number().integer().positive().optional(),
    google_map_url: yup.string().optional(),
    website_url: yup
      .string()
      .test("is-valid-url", "website_url must be a valid URL", (value) => {
        if (!value || value.trim() === "") return true; // Allow empty/null values
        const trimmedValue = value.trim();
        // Accept URLs with or without protocol (http://, https://)
        // Pattern matches: www.example.com, example.com, https://example.com, http://www.example.com/path
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
    courses: yup.array().of(yup.number().integer().positive()).optional(),
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
          course_id: yup.number().integer().positive().optional(),
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
  })
  .required();

export const createOrUpdateAdmissionSchema = yup.object({
  id: yup.number().integer().positive().optional(),
  college_id: yup.number().integer().positive().required(),
  course_id: yup.number().integer().positive().required(),
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
