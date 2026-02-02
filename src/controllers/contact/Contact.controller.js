import ContactService from "../../services/contact/Contact.service.js";

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
      const data = await contactService.createContact(req.body);

      return res.status(201).json({
        message: "Added Successfully",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Internal Server Error",
      });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.query;
      const { status } = req.body;
      const data = await contactService.updateStatus(id, status);

      return res.status(200).json({
        message: "Status updated",
        data,
      });
    } catch (error) {
      console.log(error,"YOYOYO")
      return res.status(error.status || 500).json({
        message: error.message || "Internal Server Error",
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
