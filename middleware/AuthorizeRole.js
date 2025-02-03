export const authorizeRole = (allowedRoles) => {
  return async (req, res, next) => {
    const user = req.user;

    if (!user || !user.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Raw user role:", user.role); // Debugging

    let userRoles;
    try {
      // Parse role if it's stored as a JSON string
      userRoles = typeof user.role === "string" ? JSON.parse(user.role) : user.role;
    } catch (error) {
      return res.status(500).json({ message: "Invalid role format" });
    }

    console.log("Parsed user roles:", userRoles); // Debugging

    // Check if any of the allowed roles exist and are set to true
    const hasAccess = allowedRoles.some(role => userRoles[role]);

    if (hasAccess) {
      next(); // Proceed to the next middleware or route handler
    } else {
      return res.status(403).json({ message: "Access Denied" });
    }
  };
};
