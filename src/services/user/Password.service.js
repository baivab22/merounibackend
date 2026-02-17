import bcrypt from "bcryptjs";
import UserModel from "../../models/users/User.model.js";

class PasswordService {
    async changePassword(userId, payload) {
        const { oldPassword, newPassword } = payload;

        const user = await UserModel.findByPk(userId);

        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            const error = new Error("Incorrect old password");
            error.status = 400;
            throw error;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        await user.update({ password: hashedPassword });

        return true;
    }
}

export default PasswordService;
