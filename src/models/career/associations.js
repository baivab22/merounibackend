import Career from "./Career.model.js";
import User from "../users/User.model.js";
import CareerApplication from "./CareerApplication.model.js";

Career.belongsTo(User, { foreignKey: "author_id", as: "careerAuthor" });
User.hasMany(Career, { foreignKey: "author_id", as: "careers" });

Career.hasMany(CareerApplication, {
    foreignKey: "career_id",
    as: "applications",
});
CareerApplication.belongsTo(Career, {
    foreignKey: "career_id",
    as: "career",
});

User.hasMany(CareerApplication, {
    foreignKey: "user_id",
    as: "jobApplications",
});
CareerApplication.belongsTo(User, {
    foreignKey: "user_id",
    as: "applicant",
});

export { Career, User, CareerApplication };
