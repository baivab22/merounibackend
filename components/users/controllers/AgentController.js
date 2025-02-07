import UserModel from "../model/UserModel.js";

export const applyForAgentRole = async (req, res) => {
  try {
    // const loggedInUser = req.user;

    // if (!loggedInUser) {
    //   return res.status(401).json({ message: "Unauthorized" });
    // }

    const user = await UserModel.findByPk(req.body.user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Parse existing pendingRoles
    let pendingRoles =
      typeof user.pendingRoles === "string"
        ? JSON.parse(user.pendingRoles)
        : user.pendingRoles;

    if (!Array.isArray(pendingRoles)) pendingRoles = [];

    // Check if "agent" is already requested
    if (pendingRoles.includes("agent")) {
      return res
        .status(400)
        .json({ message: "You have already applied for the Agent role." });
    }

    // Add "agent" to pendingRoles
    pendingRoles.push("agent");

    // Update user
    await user.update({ pendingRoles });

    return res
      .status(200)
      .json({ message: "Agent role application submitted successfully." });
  } catch (error) {
    console.error("Error applying for agent role:", error);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};

export const reviewAgentRequest = async (req, res) => {
  try {
    const { user_id, action } = req.body; // `action` should be "approve" or "reject"
    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Parse admin roles
    let loggedInUserRoles =
      typeof loggedInUser.role === "string"
        ? JSON.parse(loggedInUser.role)
        : loggedInUser.role;

    if (!loggedInUserRoles?.admin && !loggedInUserRoles?.["super-admin"]) {
      return res
        .status(403)
        .json({
          message: "Access denied. Only admins can review role requests.",
        });
    }

    const user = await UserModel.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Parse roles and pendingRoles
    let roles =
      typeof user.roles === "string" ? JSON.parse(user.roles) : user.roles;
    let pendingRoles =
      typeof user.pendingRoles === "string"
        ? JSON.parse(user.pendingRoles)
        : user.pendingRoles;

    if (!Array.isArray(pendingRoles)) pendingRoles = [];
    if (!roles || typeof roles !== "object") roles = {};

    // Ensure "agent" is in pendingRoles before processing
    if (!pendingRoles.includes("agent")) {
      return res
        .status(400)
        .json({ message: "No pending Agent role request found." });
    }

    if (action === "approve") {
      roles["agent"] = true;
      pendingRoles = pendingRoles.filter((role) => role !== "agent"); // Remove from pendingRoles
    } else if (action === "reject") {
      pendingRoles = pendingRoles.filter((role) => role !== "agent"); // Just remove from pendingRoles
    } else {
      return res
        .status(400)
        .json({ message: "Invalid action. Use 'approve' or 'reject'." });
    }

    await user.update({ roles, pendingRoles });

    return res.status(200).json({
      message: `Agent role request ${action}d successfully.`,
      user,
    });
  } catch (error) {
    console.error("Error reviewing agent request:", error);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};
