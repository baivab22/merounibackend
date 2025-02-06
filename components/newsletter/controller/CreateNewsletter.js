import NewsLetter from "../model/NewsletterModel.js";

export const createNewsletter = async (req, res) => {
  try {
    await NewsLetter.create(req.body);

    return res.status(201).json({
      message: "success",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error: ${error}`,
    });
  }
};
