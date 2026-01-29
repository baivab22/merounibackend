import Scholarship from "./Scholarship.model.js";
import Category from "../category/Category.model.js";
import User from "../users/User.model.js";

// Define associations
Scholarship.belongsTo(Category, { foreignKey: "category", as: "scholarshipCategory" });
Scholarship.belongsTo(User, { foreignKey: "author", as: "scholarshipAuthor" });

Category.hasMany(Scholarship, { foreignKey: "category", as: "scholarships" });
User.hasMany(Scholarship, { foreignKey: "author", as: "scholarships" });

export { Scholarship, Category, User };
