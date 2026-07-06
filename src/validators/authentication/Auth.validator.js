import * as yup from "yup";

export const loginHelper = async (data) => {
  const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  });

  try {
    const value = await schema.validate(data, { abortEarly: false });
    return { error: null, value };
  } catch (error) {
    return {
      error: {
        details: error.errors?.map((msg) => ({ message: msg })) || [
          { message: error.message },
        ],
      },
      value: null,
    };
  }
};

export const registerSchema = yup.object({
  firstName: yup.string().required(),
  middleName: yup.string().optional(),
  lastName: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  phoneNo: yup.string().required(),
  role: yup
    .string()
    .oneOf(["student", "agent"])
    .default("student")
    .optional(),
  agent_experience: yup.string().when("role", {
    is: "agent",
    then: (schema) => schema.required("Please tell us about yourself and your experiences"),
    otherwise: (schema) => schema.optional(),
  }),
  education_level: yup
    .string()
    .oneOf(["upto_class_10", "plus_two_running", "plus_two_graduate", "bachelors", "masters"])
    .optional(),
  further_education_plan: yup.string().optional(),
  roles: yup
    .string()
    .oneOf(["admin", "editor", "student", "agent", "institution"])
    .optional(),
  created_by_admin: yup.number().oneOf([0, 1]).optional(),
});

export const registerHelper = async (data) => {
  try {
    const value = await registerSchema.validate(data, { abortEarly: false });
    return { error: null, value };
  } catch (error) {
    return {
      error: {
        details: error.errors?.map((msg) => ({ message: msg })) || [
          { message: error.message },
        ],
      },
      value: null,
    };
  }
};

export const forgotPasswordHelper = async (data) => {
  const schema = yup.object({
    email: yup.string().email().required(),
  });

  try {
    const value = await schema.validate(data, { abortEarly: false });
    return { error: null, value };
  } catch (error) {
    return {
      error: {
        details: error.errors?.map((msg) => ({ message: msg })) || [
          { message: error.message },
        ],
      },
      value: null,
    };
  }
};

export const resetPasswordHelper = async (data) => {
  const schema = yup.object({
    email: yup.string().email().required(),
    otp: yup.string().required(),
    new_password: yup.string().min(6).required(),
  });

  try {
    const value = await schema.validate(data, { abortEarly: false });
    return { error: null, value };
  } catch (error) {
    return {
      error: {
        details: error.errors?.map((msg) => ({ message: msg })) || [
          { message: error.message },
        ],
      },
      value: null,
    };
  }
};
