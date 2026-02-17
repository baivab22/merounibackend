import * as yup from "yup";

// Schema for agent referred applications
export const createReferredApplicationSchema = yup
  .array()
  .of(
    yup.object({
      college_id: yup.number().integer().positive().required(),
      students: yup
        .array()
        .of(
          yup.object({
            student_name: yup.string().trim().min(2).required(),
            student_phone_no: yup
              .string()
              .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
              .required(),
            student_email: yup.string().email().required(),
            student_description: yup.string().optional(),
          })
        )
        .min(1, "At least one student is required")
        .required(),
    })
  )
  .required("Applications array is required");

// Schema for self applications (student applies themselves)
export const createSelfApplicationSchema = yup
  .object({
    referral_type: yup.string().oneOf(["self"]).default("self").required(),
    college_id: yup.number().integer().positive().required(),
    course_id: yup.number().integer().positive().nullable(),
    description: yup.string().trim().notRequired().nullable(),
  })
  .required();

export const checkIfAlreadyAppliedForCollageQuerySchema = yup
  .object({
    college_id: yup.number().integer().positive().required(),
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

export const referralIdParamSchema = yup.object({
  id: yup.number().integer().positive().required(),
});

export const updateReferralStatusSchema = yup.object({
  status: yup
    .string()
    .oneOf(["IN_PROGRESS", "ACCEPTED", "REJECTED"])
    .required(),
  remarks: yup.string().nullable().optional(),
});
