import * as yup from "yup";
import {
    paginationSchema,
    slugParamSchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema };

export const blogListQuerySchema = paginationSchema.shape({
  status: yup
    .string()
    .oneOf(["draft", "published", "archived"])
    .optional(),
  category_id: yup.string().optional(),
  category: yup.string().optional(),
})

export const createBlogSchema = yup.object({
    title: yup.string().required("Title is required"),
    category: yup.number().required("Category is required"),
    tags: yup.array().required("Tags are required"),
    description: yup.string().optional(),
    content: yup.string().optional(),
    featured_image: yup.string().optional(),
    is_featured: yup.boolean().default(false),
    author: yup.number().optional(),
    status: yup.string().optional(),
    pdf_file: yup.string().optional(),
});

export const updateBlogQuerySchema = yup.object({
    id: yup.number().integer().positive().required(),
});

export const updateBlogBodySchema = yup
    .object({
        title: yup.string(),
        category: yup.number(),
        tags: yup.array(),
        description: yup.string(),
        content: yup.string(),
        featured_image: yup.string(),
        is_featured: yup.boolean(),
        author: yup.number(),
        status: yup.string(),
        pdf_file: yup.string(),
    })
    .test("at-least-one", "At least one field must be provided", (value) => {
        return value && Object.keys(value).length > 0;
    });

export const deleteBlogQuerySchema = yup.object({
    id: yup.number().integer().positive().required(),
});

export const blogSlugParamSchema = yup.object({
    slug: yup.string().trim().required(),
});
