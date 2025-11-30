import * as yup from "yup";

export const getUserWishlistQuerySchema = yup.object({
  user_id: yup.number().integer().positive().required(),
});

export const addToWishlistSchema = yup.object({
  user_id: yup.number().integer().positive().required(),
  college_id: yup.number().integer().positive().required(),
});

export const removeFromWishlistSchema = addToWishlistSchema;
