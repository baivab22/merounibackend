
import yup from "yup";

export const createDegreeSchema = yup.object({
    title   : yup.string().required("title  is required"),
    description: yup.string().optional(),
    featured_image: yup.string().url("Must be a valid URL").optional(),
});

export const updateDegreeSchema = yup.object({
    title: yup.string().optional(),
    description: yup.string().optional(),
    featured_image: yup.string().url("Must be a valid URL").optional(),
});
