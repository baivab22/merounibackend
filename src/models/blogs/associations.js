import Blog from "./Blog.model.js";
import Category from "../category/Category.model.js";
import User from "../users/User.model.js";

// Define associations
Blog.belongsTo(Category, { foreignKey: "category", as: "blogCategory" });
Blog.belongsTo(User, { foreignKey: "author", as: "blogAuthor" });

Category.hasMany(Blog, { foreignKey: "category", as: "blogs" });
User.hasMany(Blog, { foreignKey: "author", as: "blogs" });

export { Blog, Category, User };
