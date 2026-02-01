import Program from "./Program.model.js";
import ProgramSyllabus from "./ProgramSyllabus.model.js";
import ProgramCollege from "./ProgramCollege.model.js";
import Faculty from "../faculty/Faculty.model.js";
import Scholarship from "../scholarship/Scholarship.model.js";
import College from "../college/College.model.js";
import Level from "../level/Level.model.js";
import Degree from "../degree/Degree.model.js";
import Course from "../courses/Course.model.js";
import { Exam } from "../exams/Exam.model.js";
import User from "../users/User.model.js";
import CollegeAddress from "../college/CollegeAddress.model.js";

// Program belongs to Faculty
Program.belongsTo(Faculty, { foreignKey: "faculty_id", as: "programfaculty" });
Faculty.hasMany(Program, { foreignKey: "faculty_id", as: "programs" });

// Program belongs to Level
Program.belongsTo(Level, { foreignKey: "level_id", as: "programlevel" });
Level.hasMany(Program, { foreignKey: "level_id", as: "programs" });

// Program belongs to Degree (optional)
Program.belongsTo(Degree, { foreignKey: "degree_id", as: "programdegree" });
Degree.hasMany(Program, { foreignKey: "degree_id", as: "programs" });

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


export { Program, Faculty, Scholarship, Level, Degree, Exam, User };
