export const authorizeRole = (allowedRoles) => {
  return async (req, res, next) => {
    const user = req.user;

    const roles = user.roles || user.role;

    if (!user || !roles) {
      return res.status(401).json({ message: "Unauthorized" });
    }


    let userRoles;
    try {
      // Parse roles if stored as a JSON string
      userRoles = typeof roles === "string" ? JSON.parse(roles) : roles;
    } catch (error) {
      return res.status(500).json({ message: "Invalid role format" });
    }

    // Check if any of the allowed roles exist and are set to true
    const hasAccess = allowedRoles.some(role => userRoles[role]);

    if (hasAccess) {
      next(); // Proceed to the next middleware or route handler
    } else {
      return res.status(403).json({ message: "Access Denied" });
    }
  };
};
