import Program from "./ProgramModel.js";
import ProgramSyllabus from "./ProgramSyllabusModel.js";
import ProgramCollege from "./ProgramCollege.js";
import Faculty from "../../faculty/model/FacultyModel.js";
import Scholarship from "../../scholarship/model/ScholarshipModel.js";
import College from "../../college/models/CollegeModel.js";
import Level from "../../level/model/LevelModel.js";
import Course from "../../courses/model/CourseModel.js";
import { Exam } from "../../exams/model/ExamModel.js";
import User from "../../users/model/UserModel.js";
import CollegeAddress from "../../college/models/CollegeAddress.js";

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

Program.hasMany(ProgramSyllabus, {
  foreignKey: "program_id",
  as: "syllabus",
});
ProgramSyllabus.belongsTo(Program, {
  foreignKey: "program_id",
  as: "program",
});

// Syllabus belongs to a Course
ProgramSyllabus.belongsTo(Course, {
  foreignKey: "course_id",
  as: "programCourse",
});
Course.hasMany(ProgramSyllabus, {
  foreignKey: "course_id",
  as: "syllabusEntries",
});

// Associations for Program
Program.belongsToMany(College, { 
  through: ProgramCollege, 
  foreignKey: "program_id", 
  as: "colleges" // Alias for the association
});
College.belongsToMany(Program, { 
  through: ProgramCollege, 
  foreignKey: "college_id", 
  as: "programs" 
});

// Assoociations for College Address
Program.belongsToMany(CollegeAddress, { 
  through: ProgramCollege, 
  foreignKey: "program_id", 
  as: "collegesAddress" // Alias for the association
});
CollegeAddress.belongsToMany(Program, { 
  through: ProgramCollege, 
  foreignKey: "college_id", 
  as: "programs" 
});


export { Program, Faculty, Scholarship, Level, Exam, User };
