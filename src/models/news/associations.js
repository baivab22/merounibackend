import News from "./News.model.js";
import Category from "../category/Category.model.js";
import User from "../users/User.model.js";
import College from "../college/College.model.js";

// Define associations
News.belongsTo(User, { foreignKey: "author", as: "newsAuthor" });
User.hasMany(News, { foreignKey: "author", as: "news" });

News.belongsTo(Category, { foreignKey: "category", as: "newsCategory" });
Category.hasMany(News, { foreignKey: "category", as: "news" });

News.belongsTo(College, { foreignKey: "college_id", as: "newsCollege" });
College.hasMany(News, { foreignKey: "college_id", as: "news" });

export { News, Category, User, College };
