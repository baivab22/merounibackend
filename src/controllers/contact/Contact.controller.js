import Joi from "joi";

import ContactService from "../../services/contact/Contact.service.js";

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

const contactService = new ContactService();

class ContactController {
  static async listContacts(req, res) {
    try {
      const { items, pagination } = await contactService.listContacts(
        req.query
      );
      return res.status(200).json({
        message: "Contact Us retrieved",
        items,
        pagination,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Error: ${error}`,
      });
    }
  }

  static async getContact(req, res) {
    try {
      const { email } = req.query;
      const item = await contactService.getContactByEmail(email);

      return res.status(200).json({
        message: "Retrieved",
        item,
      });
    } catch (error) {
      return res.status(500).json({
        message: `Error: ${error}`,
      });
    }
  }

  static async addContact(req, res) {
    try {
      const { error, value } = contactSchema.validate(req.body);

      if (error) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }

      const data = await contactService.createContact(value);

      return res.status(201).json({
        message: "Added Successfully",
        data,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message || "Internal Server Error",
      });
    }
  }

  static async deleteContact(req, res) {
    try {
      await contactService.deleteContact(req.query.id);
      return res.status(200).json({ message: "Contact deleted" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default ContactController;
