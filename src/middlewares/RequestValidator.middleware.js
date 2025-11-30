export const requestValidator =
  (schema, property = "body") =>
  async (req, res, next) => {
    try {
      const value = await schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true,
        strict: false,
      });

      req[property] = value;
      return next();
    } catch (error) {
      return res.status(400).json({
        message: error.errors ? error.errors.join(", ") : error.message,
      });
    }
  };

export const requestValidatorMultiple = (schemas) => async (req, res, next) => {
  try {
    for (const { schema, property } of schemas) {
      const value = await schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true,
        strict: false,
      });

      req[property] = value;
    }

    return next();
  } catch (error) {
    return res.status(400).json({
      message: error.errors ? error.errors.join(", ") : error.message,
    });
  }
};
