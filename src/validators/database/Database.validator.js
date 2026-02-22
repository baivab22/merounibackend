import Joi from "joi";

export const listDownloadsSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    type: Joi.string().optional(),
});

export const trackDownloadSchema = Joi.object({
    fileName: Joi.string().required(),
    downloadType: Joi.string().required(),
    referenceId: Joi.number().integer().optional(),
});
