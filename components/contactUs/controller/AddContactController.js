import ContactUs from "../model/ContactModel.js";

export const addContactController = async (req, res) => {
  try {
    let data = ContactUs.create(req.body);

    return res.status(201).json({
      message: `Added Successfully`,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error: ${error}`,
    });
  }
};