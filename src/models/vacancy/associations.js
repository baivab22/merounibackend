import VacancyModel from "./Vacancy.model.js";
import UserModel from "../users/User.model.js";
import CollegeModel from "../college/College.model.js";

// Define associations
VacancyModel.belongsTo(UserModel, { foreignKey: "author_id", as: "vacancyAuthor" });
UserModel.hasMany(VacancyModel, { foreignKey: "author_id", as: "vacancies" });

VacancyModel.belongsTo(CollegeModel, { foreignKey: "college_id", as: "vacancyCollege" });
CollegeModel.hasMany(VacancyModel, { foreignKey: "college_id", as: "vacancies" });

export { VacancyModel, UserModel };
