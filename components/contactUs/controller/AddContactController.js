import Joi from "joi";
import ContactUs from "../model/ContactModel.js";

const contactSchema = Joi.object({
  fullname: Joi.string().required().messages({
    "any.required": "Fullname is required",
  }),

  email: Joi.string().email().required().messages({
    "any.required": "Email is required",
  }),

  subject: Joi.string().required().messages({
    "any.required": "Subject is required",
  }),

  message: Joi.string().optional(),
});

export const addContactController = async (req, res) => {
  try {
    let { error, value } = contactSchema.validate(req.body);

    // If validation fails, return the error message
    if (error) {
      return res.status(400).json({
        message: error.details[0].message, // Custom error message from Joi
      });
    }

    // Await the asynchronous create method
    let data = await ContactUs.create(value);

    return res.status(201).json({
      message: "Added Successfully",
      data,
    });
  } catch (error) {
    // If there's an error, return the error message
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};
