import * as yup from "yup";
import {
    paginationSchema,
    slugParamSchema,
} from "../common/common.validator.js";

export { paginationSchema, slugParamSchema };

export const createBlogSchema = yup.object({
    title: yup.string().required("Title is required"),
    category: yup.number().required("Category is required"),
    tags: yup.array().required("Tags are required"),
    description: yup.string().optional(),
    content: yup.string().optional(),
    featuredImage: yup.string().optional(),
    is_featured: yup.number().default(0),
    author: yup.number().optional(),
    reactions: yup.object().optional(),
    status: yup.string().optional(),
    visibility: yup.string().optional(),
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
        featuredImage: yup.string(),
        is_featured: yup.number(),
        author: yup.number(),
        reactions: yup.object(),
        status: yup.string(),
        visibility: yup.string(),
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
