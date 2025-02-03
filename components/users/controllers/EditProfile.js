import UserModel from "../model/UserModel.js";
import bcrypt from "bcrypt";

export const updateUserProfile = async (req, res) => {
  try {
    let { user_id } = req.query;
    let updates = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const loggedInUser = req.user;

    if (!loggedInUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Ensure users can only update their own profile
    if (loggedInUser.id !== parseInt(user_id)) {
      return res
        .status(403)
        .json({ message: "You can only update your own profile!" });
    }

    const user = await UserModel.findByPk(user_id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If updating password, hash it before storing
    if (updates.password) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(updates.password, saltRounds);
      updates.password = hashedPassword;
    }

    // Update the user profile with allowed fields
    await user.update(updates);

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};
