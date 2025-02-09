import User from "../../users/model/UserModel.js";
import Faculty from "./FacultyModel.js";

Faculty.belongsTo(User, {
  foreignKey: "author",
  as: "authorDetails",
});

User.hasMany(Faculty, {
  foreignKey: "author",
  as: "faculty",
});

export { Faculty, User };
