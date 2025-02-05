import News from "../model/NewsModel.js";
import Category from "../../category/model/CategoryModel.js";
import User from "../../users/model/UserModel.js";

// Define associations
News.belongsTo(Category, { foreignKey: "category", as: "newsCategory" });
News.belongsTo(User, { foreignKey: "author", as: "newsAuthor" });

Category.hasMany(News, { foreignKey: "category", as: "news" });
User.hasMany(News, { foreignKey: "author", as: "news" });

export { News, Category, User };
