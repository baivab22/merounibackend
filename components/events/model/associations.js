import Event from "../../events/model/EventModel.js";
import Category from "../../category/model/CategoryModel.js";
import College from "../../college/models/CollegeModel.js";
import User from "../../users/model/UserModel.js";

// Define associations
Event.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Event.belongsTo(College, { foreignKey: "college_id", as: "college" });
Event.belongsTo(User, { foreignKey: "author_id", as: "author" });

Category.hasMany(Event, { foreignKey: "category_id", as: "events" });
College.hasMany(Event, { foreignKey: "college_id", as: "events" });
User.hasMany(Event, { foreignKey: "author_id", as: "events" });

export { Event, Category, College, User };
