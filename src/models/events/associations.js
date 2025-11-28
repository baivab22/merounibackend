import Event from "./Event.model.js";
import Category from "../category/Category.model.js";
import College from "../college/College.model.js";
import User from "../users/User.model.js";

// Define associations
Event.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Event.belongsTo(College, { foreignKey: "college_id", as: "college" });
Event.belongsTo(User, { foreignKey: "author_id", as: "author" });

Category.hasMany(Event, { foreignKey: "category_id", as: "events" });
College.hasMany(Event, { foreignKey: "college_id", as: "events" });
User.hasMany(Event, { foreignKey: "author_id", as: "events" });

export { Event, Category, College, User };
