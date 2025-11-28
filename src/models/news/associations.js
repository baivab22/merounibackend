import News from "./News.model.js";
import Category from "../category/Category.model.js";
import User from "../users/User.model.js";

// Define associations
News.belongsTo(Category, { foreignKey: "category", as: "newsCategory" });
News.belongsTo(User, { foreignKey: "author", as: "newsAuthor" });

Category.hasMany(News, { foreignKey: "category", as: "news" });
User.hasMany(News, { foreignKey: "author", as: "news" });

export { News, Category, User };
