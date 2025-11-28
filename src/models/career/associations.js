import Career from "./Career.model.js";
import User from "../users/User.model.js";

Career.belongsTo(User, { foreignKey: "author_id", as: "careerAuthor" });
User.hasMany(Career, { foreignKey: "author_id", as: "careers" });

export { Career, User };
