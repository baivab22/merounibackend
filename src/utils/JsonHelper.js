/**
 * Safely parses a JSON value.
 * If the value is already an object or array, it returns it as is.
 * If it's a string, it tries to parse it.
 * If parsing fails or the value is null/undefined, it returns the provided default value.
 *
 * @param {any} value - The value to parse.
 * @param {any} defaultValue - The value to return if parsing fails.
 * @returns {any}
 */
export const safeParseJSON = (value, defaultValue = []) => {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  if (typeof value === 'object') {
    return value;
  }

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(`Error parsing JSON: ${value}`, error);
      return defaultValue;
    }
  }

  return defaultValue;
};
