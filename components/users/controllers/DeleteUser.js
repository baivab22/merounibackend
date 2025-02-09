import UserModel from "../model/UserModel.js";
import { roleHelper } from "../../authentication/helper/RoleHelper.js";

export const deleteUser = async (req, res) => {
  try {
    let { id, role } = req.user;
    let {user_id} = req.body;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get parsed roles using the helper function
    const loggedInUserRoles = roleHelper(role);

    console.log(`Pre-role: ${role} \n Post Role: ${loggedInUserRoles}`)

    if (!loggedInUserRoles) {
      return res.status(500).json({ message: "Invalid role format" });
    }

    // Check if logged-in user has admin or super-admin role
    const isAdmin =
      loggedInUserRoles?.admin || loggedInUserRoles?.["super-admin"];

    // Allow admins to delete any user OR allow users to delete their own account
    if (!isAdmin && loggedInUser.id !== parseInt(user_id)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this account!" });
    }

    const user = await UserModel.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in Delete User:", error);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};
