
import yup from "yup";

export const createDegreeSchema = yup.object({
    short_name: yup.string().required("Short name is required"),
    title: yup.string().required("title is required"),
    description: yup.string().nullable().optional(),
    featured_image: yup.string().url("Must be a valid URL").nullable().optional(),
    disciplines: yup.array().nullable().optional(),
});

export const updateDegreeSchema = yup.object({
    short_name: yup.string().optional(),
    title: yup.string().optional(),
    description: yup.string().nullable().optional(),
    featured_image: yup.string().url("Must be a valid URL").nullable().optional(),
    disciplines: yup.array().nullable().optional(),
});
