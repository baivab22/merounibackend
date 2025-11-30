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

export const registerHelper = async (data) => {
  const schema = yup.object({
    firstName: yup.string().required(),
    middleName: yup.string().optional(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
    roles: yup
      .string()
      .oneOf([
        "super-admin",
        "admin",
        "editor",
        "teacher",
        "student",
        "college-admin",
      ])
      .default("student")
      .optional(),
    phoneNo: yup.number().required(),
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
    otp: yup.number().required(),
    new_password: yup.string().required(),
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
