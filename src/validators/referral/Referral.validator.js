import * as yup from "yup";

// Create Referred Application schema
export const createReferredApplicationSchema = yup
  .object({
    // Add required fields based on your Referral model
  })
  .required();

// Create Self Application schema
export const createSelfApplicationSchema = yup
  .object({
    // Add required fields based on your Referral model
  })
  .required();

export const applicationTypeParamSchema = yup.object({
  type: yup.string().trim().required(),
});

export const collegeIdParamSchema = yup.object({
  college_id: yup.number().integer().positive().required(),
});

export const collegeIdAndTypeParamSchema = yup.object({
  college_id: yup.number().integer().positive().required(),
  type: yup.string().trim().required(),
});
