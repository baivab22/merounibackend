import Joi from "joi";

export const loginHelper = (data) => {
  let schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

export const registerHelper = (data) => {
  let schema = Joi.object({
    firstName: Joi.string().required(),
    middleName: Joi.string().optional(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    roles: Joi.string()
      .default("student")
      .valid("super-admin", "admin", "editor", "teacher", "student")
      .optional(""),
    phoneNo: Joi.number().required(),
  });

  return schema.validate(data);
};

export const forgotPasswordHelper = (data) => {
  let schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(data);
};

export const resetPasswordHelper = (data) => {
  let schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().required(),
    new_password: Joi.string().required(),
  });
  return schema.validate(data);
};
