/**
 * Normalize thrown errors into HTTP status + user-facing message(s).
 */
export function formatServiceError(error) {
  if (!error) {
    return { status: 500, message: "Server error" };
  }

  if (error.status && error.message) {
    return {
      status: error.status,
      message: error.message,
      errors: error.errors,
    };
  }

  if (error.name === "ValidationError" && Array.isArray(error.errors)) {
    const messages = error.errors.filter(Boolean);
    return {
      status: 400,
      message: messages.join(", ") || error.message,
      errors: error.inner?.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    };
  }

  if (error.name === "SequelizeValidationError") {
    const details =
      error.errors?.map((e) => ({
        field: e.path,
        message: e.message,
      })) || [];
    const message =
      details.length > 0
        ? details.map((e) => `${e.field}: ${e.message}`).join(", ")
        : error.message;
    return { status: 400, message, errors: details };
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    const details =
      error.errors?.map((e) => ({
        field: e.path,
        message: e.message,
      })) || [];
    const field = details[0]?.field || "field";
    return {
      status: 400,
      message:
        details.length > 0
          ? details.map((e) => `${e.field}: must be unique`).join(", ")
          : `${field} must be unique`,
      errors: details,
    };
  }

  if (error.name === "SequelizeForeignKeyConstraintError") {
    return {
      status: 400,
      message:
        "Invalid school/college or program reference. Please re-select and try again.",
    };
  }

  return {
    status: 500,
    message: error.message || "Server error",
  };
}
