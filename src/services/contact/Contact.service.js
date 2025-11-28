import ContactUs from "../../models/contactUs/Contact.model.js";

class ContactService {
  async listContacts(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;
    const offset = (page - 1) * limit;

    const { count: totalCount, rows: items } = await ContactUs.findAndCountAll({
      limit,
      offset,
      distinct: true,
      order: [["createdAt", "DESC"]],
    });

    return {
      items,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        limit,
        totalCount,
      },
    };
  }

  async getContactByEmail(email) {
    return ContactUs.findOne({ where: { email } });
  }

  async createContact(data) {
    return ContactUs.create(data);
  }

  async deleteContact(id) {
    const contact = await ContactUs.findByPk(id);
    if (!contact) {
      const error = new Error("Contact not found");
      error.status = 404;
      throw error;
    }

    await contact.destroy();
  }
}

export default ContactService;
