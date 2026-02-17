import * as yup from "yup";

export const getUserWishlistQuerySchema = yup.object({
  user_id: yup.number().integer().positive().required(),
});

export const addToWishlistSchema = yup.object({
  user_id: yup.number().integer().positive().required(),
  college_id: yup.number().integer().positive().nullable(),
  consultancy_id: yup.number().integer().positive().nullable(),
}).test(
  'one-of-required',
  'Either college_id or consultancy_id is required',
  function (value) {
    return !!(value.college_id || value.consultancy_id);
  }
);

export const removeFromWishlistSchema = addToWishlistSchema;
