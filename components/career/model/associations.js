import Career from "../model/CareerModel.js";
import User from "../../users/model/UserModel.js";

Career.belongsTo(User, { foreignKey: "author_id", as: "careerAuthor" });
User.hasMany(Career, { foreignKey: "author_id", as: "careers" });

export { Career, User };
