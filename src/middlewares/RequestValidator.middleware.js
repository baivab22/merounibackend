export const requestValidator =
  (schema, property = "body") =>
  async (req, res, next) => {
    try {
      // Log the request data before validation
      if (property === "body") {
        console.log(
          `[RequestValidator] req.body:`,
          JSON.stringify(req.body, null, 2)
        );
      } else if (property === "query") {
        console.log(
          `[RequestValidator] req.query:`,
          JSON.stringify(req.query, null, 2)
        );
      } else if (property === "params") {
        console.log(
          `[RequestValidator] req.params:`,
          JSON.stringify(req.params, null, 2)
        );
      }

      const value = await schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true,
        strict: false,
      });

      req[property] = value;
      return next();
    } catch (error) {
      console.error(
        `[RequestValidator] Validation error for ${property}:`,
        error.errors || error.message
      );
      const fieldErrors =
        error.inner?.map((e) => ({
          field: e.path,
          message: e.message,
        })) || [];
      const message = error.errors?.length
        ? error.errors.join(", ")
        : error.message;
      return res.status(400).json({
        status: 400,
        message,
        errors: fieldErrors,
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
    const fieldErrors =
      error.inner?.map((e) => ({
        field: e.path,
        message: e.message,
      })) || [];
    const message = error.errors?.length
      ? error.errors.join(", ")
      : error.message;
    return res.status(400).json({
      status: 400,
      message,
      errors: fieldErrors,
    });
  }
};
