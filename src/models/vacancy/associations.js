import VacancyModel from "./Vacancy.model.js";
import UserModel from "../users/User.model.js";

// Define associations
VacancyModel.belongsTo(UserModel, {
  foreignKey: "author_id",
  as: "vacancyAuthor",
});
UserModel.hasMany(VacancyModel, { foreignKey: "author_id", as: "vacancies" });

export { VacancyModel, UserModel };
