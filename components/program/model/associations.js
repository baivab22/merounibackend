import Program from "./ProgramModel.js";
import Faculty from "../../faculty/model/FacultyModel.js";
import Scholarship from "../../scholarship/model/ScholarshipModel.js";
import Level from "../../level/model/LevelModel.js";
import { Exam } from "../../exams/model/ExamModel.js";
import User from "../../users/model/UserModel.js";

// Program belongs to Faculty
Program.belongsTo(Faculty, { foreignKey: "faculty_id", as: "programfaculty" });
Faculty.hasMany(Program, { foreignKey: "faculty_id", as: "programs" });

// Program belongs to Level
Program.belongsTo(Level, { foreignKey: "level_id", as: "programlevel" });
Level.hasMany(Program, { foreignKey: "level_id", as: "programs" });

// Program belongs to Scholarship (optional)
Program.belongsTo(Scholarship, {
  foreignKey: "scholarship_id",
  as: "programscholarship",
});
Scholarship.hasMany(Program, { foreignKey: "scholarship_id", as: "programs" });

// Program belongs to Exam (optional)
Program.belongsTo(Exam, { foreignKey: "exam_id", as: "programexam" });
Exam.hasMany(Program, { foreignKey: "exam_id", as: "programs" });

// Program belongs to an Author (User)
Program.belongsTo(User, { foreignKey: "author", as: "programauthorDetails" });
User.hasMany(Program, { foreignKey: "author", as: "programs" });

export { Program, Faculty, Scholarship, Level, Exam, User };
