import * as yup from "yup";
import { paginationSchema as basePaginationSchema, idParamSchema } from "../common/common.validator.js";

export { idParamSchema };

export const MEMBERSHIP_STATUSES = ["PENDING", "APPROVED", "REJECTED", "EXPIRED"];
export const UNDECIDED_FIELD = "unsure";
export const MEMBERSHIP_OPTION_TYPES = ["LEVEL", "CAREER_FIELD", "PAYMENT_METHOD"];

// The browser generates the reference when the member picks a payment method
// (the application row does not exist yet at that point), so it arrives on the
// apply/guest-apply bodies. Keep this in sync with REFERENCE_PATTERN in
// StudentMembership.service.js. Omitting it is allowed — the server generates
// one instead.
export const REFERENCE_PATTERN = /^MU-\d{2}-[23456789A-HJ-NP-Z]{8}$/;

export const paginationSchema = basePaginationSchema.shape({
  status: yup.string().oneOf(MEMBERSHIP_STATUSES).optional(),
  membershipType: yup.string().trim().max(80).optional(),
});

// Accepts null / "" / undefined and normalises them to undefined so optional
// fields never fail validation with "must be one of".
const nullableString = () =>
  yup
    .string()
    .trim()
    .transform((value) =>
      value === null || value === undefined || value === ""
        ? undefined
        : value
    )
    .optional();

export const membershipFieldsSchema = yup.object({
  reference_id: nullableString()
    .trim()
    .transform((value) =>
      value === null || value === undefined || value === ""
        ? undefined
        : String(value).toUpperCase()
    )
    .matches(
      REFERENCE_PATTERN,
      "Invalid payment reference format. Expected MU-YY-XXXXXXXX"
    )
    .optional(),
  career_field: nullableString()
    .max(80, "Career field is too long")
    .matches(
      /^[A-Za-z0-9_-]+$/,
      "Career field may only contain letters, numbers, dashes and underscores"
    ),
  selected_trainings: yup
    .array()
    .of(
      yup
        .string()
        .trim()
        .min(2, "Training title is too short")
        .max(120, "Training title is too long")
        .required("Training title is required")
    )
    .max(20, "Too many trainings selected")
    .transform((value) => (value === null ? [] : value))
    .when("career_field", {
      is: (careerField) => !!careerField && careerField !== UNDECIDED_FIELD,
      then: (schema) =>
        schema
          .min(1, "Select at least one training")
          .required("Select at least one training"),
      otherwise: (schema) => schema,
    })
    .optional(),
  institution: nullableString().max(160, "Institution name is too long"),
  payment_method: nullableString().max(60, "Payment method is too long"),
  membership_fee: nullableString().max(60, "Membership fee is too long"),
});

export const applyForMembershipSchema = yup
  .object({
    membership_type: yup
      .string()
      .trim()
      .max(80, "Membership type is too long")
      .required("Membership type is required"),
    payment_proof_url: nullableString().max(
      2048,
      "Payment proof URL is too long"
    ),
    remarks: nullableString().max(2000, "Remarks is too long"),
  })
  .concat(membershipFieldsSchema)
  .strict(false);

export const guestApplyForMembershipSchema = yup.object({
  student_name: yup.string().trim().required("Full name is required"),
  student_email: yup
    .string()
    .trim()
    .transform((value) =>
      value === null || value === undefined || value === ""
        ? undefined
        : value
    )
    .email("Invalid email")
    .optional(),
  student_phone_no: yup.string().trim().required("Phone number is required"),
  membership_type: yup
    .string()
    .trim()
    .max(80, "Membership type is too long")
    .required("Membership type is required"),
  payment_proof_url: nullableString().max(
    2048,
    "Payment proof URL is too long"
  ),
  remarks: nullableString().max(2000, "Remarks is too long"),
}).concat(membershipFieldsSchema);

export const updateMembershipSchema = yup.object({
  membership_type: yup
    .string()
    .trim()
    .max(80, "Membership type is too long")
    .optional(),
  payment_proof_url: nullableString().max(
    2048,
    "Payment proof URL is too long"
  ),
});

export const optionListQuerySchema = yup.object({
  type: yup.string().oneOf(MEMBERSHIP_OPTION_TYPES).optional(),
  is_active: yup.boolean().optional(),
  q: yup.string().trim().optional(),
});

export const optionParamSchema = yup.object({
  id: yup.number().integer().positive().required("Option id is required"),
});

const optionMetadataSchema = yup
  .mixed()
  .test("metadata-json", "Metadata must be valid JSON", (value) => {
    if (value === undefined || value === null || value === "") return true;
    if (typeof value === "object") return true;
    if (typeof value !== "string") return false;
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  });

export const createOptionSchema = yup.object({
  type: yup
    .string()
    .oneOf(MEMBERSHIP_OPTION_TYPES, "Invalid option type")
    .required("Option type is required"),
  slug: yup
    .string()
    .trim()
    .max(80, "Slug is too long")
    .matches(/^[A-Za-z0-9_-]+$/, "Slug may only contain letters, numbers, dashes and underscores")
    .required("Slug is required"),
  label: yup.string().trim().max(160, "Label is too long").required("Label is required"),
  description: nullableString(),
  metadata: optionMetadataSchema.optional(),
  sort_order: yup.number().integer().optional(),
  is_active: yup.boolean().optional(),
});

export const updateOptionSchema = yup.object({
  type: yup.string().oneOf(MEMBERSHIP_OPTION_TYPES, "Invalid option type").optional(),
  slug: yup
    .string()
    .trim()
    .max(80, "Slug is too long")
    .matches(/^[A-Za-z0-9_-]+$/, "Slug may only contain letters, numbers, dashes and underscores")
    .optional(),
  label: yup.string().trim().max(160, "Label is too long").optional(),
  description: nullableString(),
  metadata: optionMetadataSchema.optional(),
  sort_order: yup.number().integer().optional(),
  is_active: yup.boolean().optional(),
});

export const updateMembershipStatusSchema = yup.object({
  status: yup
    .string()
    .oneOf(MEMBERSHIP_STATUSES, "Invalid status")
    .required("Status is required"),
  start_date: yup.date().nullable().optional(),
  end_date: yup.date().nullable().optional(),
  remarks: nullableString().max(2000, "Remarks is too long"),
});
