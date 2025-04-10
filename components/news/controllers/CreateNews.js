import slug from "slug";
import Joi from "joi";
import Blog from "../model/NewsModel.js";

// Joi Schema for validation
const newsSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title is required",
  }),

  category: Joi.number().required().messages({
    "any.required": "Category is required",
  }),

  tags: Joi.array().required().messages({
    "any.required": "Tags are required",
  }),

  description: Joi.string().optional(),
  content: Joi.string().optional(),
  featuredImage: Joi.string().optional(),
  is_featured: Joi.number().default(0),
  author: Joi.number().optional(),
  reactions: Joi.object().optional(),
  status: Joi.string().optional(),
  visibility: Joi.string().optional(),
});

export const createBlog = async (req, res) => {
  try {
    const { error, value } = newsSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }

    // Create new blog post
    const newBlog = await Blog.create({
      ...value,
      slug: slug(value.title),
    });

    return res.status(201).json({ message: "Blog created", blog: newBlog });
  } catch (error) {
    console.error("Error creating blog:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
