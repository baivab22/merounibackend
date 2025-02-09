export const roleHelper = (role) => {
  if (!role) return null;

  try {
    return typeof role === "string" ? JSON.parse(role) : role;
  } catch (error) {
    console.error("Error parsing roles:", error);
    return null;
  }
};
