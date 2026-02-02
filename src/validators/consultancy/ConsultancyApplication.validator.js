import * as yup from "yup";

export const applyConsultancySchema = yup.object({
  consultancy_id: yup
    .number()
    .integer()
    .positive()
    .required("Consultancy ID is required"),
  student_description: yup.string().optional(),
});

export const updateConsultancyApplicationStatusSchema = yup.object({
  status: yup
    .string()
    .oneOf(["IN_PROGRESS", "ACCEPTED", "REJECTED"], "Invalid status")
    .required("Status is required"),
  remarks: yup.string().trim().optional(),
});
