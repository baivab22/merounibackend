import * as yup from "yup";

// Create Discipline schema
export const createDisciplineSchema = yup.object({
    title: yup.string().trim().required("Title is required for creating a discipline"),
    featured_image: yup.string().trim().optional(),
    status: yup.mixed().oneOf(["active", "inactive"]).optional(),
    description: yup.string().trim().optional(),
});

// Update Discipline schema
export const updateDisciplineSchema = yup.object({
    title: yup.string().trim().optional(),
    featured_image: yup.string().trim().optional(),
    status: yup.mixed().oneOf(["active", "inactive"]).optional(),
    description: yup.string().trim().optional(),
});
