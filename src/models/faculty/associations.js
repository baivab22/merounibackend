import User from "../users/User.model.js";
import Faculty from "./Faculty.model.js";

Faculty.belongsTo(User, {
  foreignKey: "author",
  as: "authorDetails",
});

User.hasMany(Faculty, {
  foreignKey: "author",
  as: "faculty",
});

export { Faculty, User };
