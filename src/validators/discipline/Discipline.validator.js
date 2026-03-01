import * as yup from "yup";

// Create Discipline schema
export const createDisciplineSchema = yup.object({
    title: yup.string().trim().required("Title is required for creating a discipline"),
    featured_image: yup.string().trim().optional(),
    description: yup.string().trim().optional(),
    content: yup.string().trim().optional(),
});

// Update discipline order schema
export const updateDisciplineOrderSchema = yup
    .object({
        disciplines: yup
            .array()
            .of(
                yup.object({
                    id: yup.number().integer().positive().required(),
                    order_no: yup.number().integer().min(0).required(),
                })
            )
            .min(1)
            .required(),
    })
    .required();

// Update Discipline schema
export const updateDisciplineSchema = yup.object({
    title: yup.string().trim().optional(),
    featured_image: yup.string().trim().optional(),
    description: yup.string().trim().optional(),
    content: yup.string().trim().optional(),
});
