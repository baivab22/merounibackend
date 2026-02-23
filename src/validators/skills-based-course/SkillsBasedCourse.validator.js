import * as yup from "yup";

// Create SkillsBasedCourse schema
export const createSkillsBasedCourseSchema = yup.object({
    title: yup.string().trim().required("Title is required for creating a course"),
    description: yup.string().optional(),
    content: yup.string().optional(),
    thumbnail_image: yup.string().optional(),
    status: yup.mixed().oneOf(["active", "inactive"]).optional(),
    price: yup.number().positive().optional(),
    duration: yup.string().optional(),
    is_featured: yup.boolean().optional(),
    institution_name: yup.string().optional(),
    likes_count: yup.number().integer().min(0).optional(),
});

// Update SkillsBasedCourse schema
export const updateSkillsBasedCourseSchema = yup.object({
    title: yup.string().trim().optional(),
    description: yup.string().optional(),
    content: yup.string().optional(),
    thumbnail_image: yup.string().optional(),
    status: yup.mixed().oneOf(["active", "inactive"]).optional(),
    price: yup.number().positive().optional(),
    duration: yup.string().optional(),
    is_featured: yup.boolean().optional(),
    likes_count: yup.number().integer().min(0).optional(),
    institution_name: yup.string().optional(),
});
