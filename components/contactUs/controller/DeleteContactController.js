import ContactUs from "../model/ContactModel.js";

// Delete College
export const deleteContact = async (req, res) => {
  try {
    const contact = await ContactUs.findByPk(req.query.id);
    if (!contact) return res.status(404).json({ error: "Contact not found" });

    await contact.destroy();
    res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
