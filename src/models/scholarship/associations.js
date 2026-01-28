import Scholarship from "./Scholarship.model.js";
import Category from "../category/Category.model.js";
import User from "../users/User.model.js";

// Define associations
Scholarship.belongsTo(Category, { foreignKey: "category_id", as: "scholarshipCategory" });
Scholarship.belongsTo(User, { foreignKey: "author_id", as: "scholarshipAuthor" });

Category.hasMany(Scholarship, { foreignKey: "category_id", as: "scholarships" });
User.hasMany(Scholarship, { foreignKey: "author_id", as: "scholarships" });

export { Scholarship, Category, User };
