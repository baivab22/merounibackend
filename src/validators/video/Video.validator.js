import * as yup from "yup";

// Create Video schema
export const createVideoSchema = yup.object({
    title: yup.string().trim().required("Title is required"),
    yt_video_link: yup.string().trim().required("YouTube video link is required"),
    featured_image: yup.string().trim().optional(),
    description: yup.string().trim().optional(),
    status: yup.string().trim().optional(),
});

// Update Video schema
export const updateVideoSchema = yup.object({
    title: yup.string().trim().optional(),
    yt_video_link: yup.string().trim().optional(),
    featured_image: yup.string().trim().optional(),
    description: yup.string().trim().optional(),
    status: yup.string().trim().optional(),
});
