import * as yup from "yup";
import { paginationSchema } from "../common/common.validator.js";

export { paginationSchema };

export const createCollegeRankingSchema = yup
  .object({
    degree_id: yup.number().integer().positive().required(),
    college_id: yup.number().integer().positive().required(),
    rank: yup.number().integer().positive().optional(),
    description: yup.string().nullable().optional(),
    content: yup.string().nullable().optional(),
  })
  .required();

export const updateRankingOrderSchema = yup
  .object({
    degree_id: yup.number().integer().positive().required(),
    rankings: yup
      .array()
      .of(
        yup.object({
          id: yup.number().integer().positive().required(),
          rank: yup.number().integer().positive().required(),
        }),
      )
      .min(1)
      .required(),
  })
  .required();

export const deleteRankingQuerySchema = yup.object({
  ranking_id: yup.number().integer().positive().required(),
});

export const deleteDegreeRankingsQuerySchema = yup.object({
  degree_id: yup.number().integer().positive().required(),
});

export const getRankingsByDegreeQuerySchema = yup.object({
  degree_id: yup.number().integer().positive().required(),
});

export const updateDegreeDescriptionSchema = yup
  .object({
    degree_id: yup.number().integer().positive().required(),
    description: yup.string().nullable().optional(),
    content: yup.string().nullable().optional(),
  })
  .required();
