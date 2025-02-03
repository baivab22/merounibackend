export const logoutUser = async (req, res) => {
  try {
    // Clear the access token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    // Optionally remove the refresh token from the frontend storage (handled on the client-side)
    res.setHeader("x-refresh-token", "");

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};
