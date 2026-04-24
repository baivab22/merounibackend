import Program from "./Program.model.js";
import ProgramDegree from "./ProgramDegree.model.js";
import ProgramSyllabus from "./ProgramSyllabus.model.js";
import CollegeOfferingProgram from "../college/CollegeOfferingProgram.model.js";
import Scholarship from "../scholarship/Scholarship.model.js";
import College from "../college/College.model.js";
import Level from "../level/Level.model.js";
import Degree from "../degree/Degree.model.js";
import Course from "../courses/Course.model.js";
import { Exam } from "../exams/Exam.model.js";
import User from "../users/User.model.js";
import CollegeAddress from "../college/CollegeAddress.model.js";
import { University, UniversityProgram } from "../university/University.model.js";
import Board from "../board/Board.model.js";
import Stream from "../stream/Stream.model.js";
import StreamProgram from "../stream/StreamProgram.model.js";




// Program belongs to Level
Program.belongsTo(Level, { foreignKey: "level_id", as: "programlevel" });
Level.hasMany(Program, { foreignKey: "level_id", as: "programs" });

// Program <-> Degree (many-to-many)
Program.belongsToMany(Degree, {
  through: ProgramDegree,
  foreignKey: "program_id",
  otherKey: "degree_id",
  as: "degrees",
});
Degree.belongsToMany(Program, {
  through: ProgramDegree,
  foreignKey: "degree_id",
  otherKey: "program_id",
  as: "programs",
});

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

// Associations for Program (Moved to CollegeProgram.model.js)


// Assoociations for College Address
Program.belongsToMany(CollegeAddress, {
  through: CollegeOfferingProgram,
  foreignKey: "program_id",
  as: "collegesAddress" // Alias for the association
});
CollegeAddress.belongsToMany(Program, {
  through: CollegeOfferingProgram,
  foreignKey: "college_id",
  as: "programs"
});

// Program <-> University (many-to-many through existing university_programs junction table)
Program.belongsToMany(University, {
  through: UniversityProgram,
  foreignKey: "program_id",
  otherKey: "university_id",
  as: "universities",
});
University.belongsToMany(Program, {
  through: UniversityProgram,
  foreignKey: "university_id",
  otherKey: "program_id",
  as: "programs",
});

// Board has many Streams
Board.hasMany(Stream, { foreignKey: "board_id", as: "streams" });
Stream.belongsTo(Board, { foreignKey: "board_id", as: "board" });

// Stream <-> Program (many-to-many through stream_programs)
Stream.belongsToMany(Program, {
  through: StreamProgram,
  foreignKey: "stream_id",
  otherKey: "program_id",
  as: "programs"
});
Program.belongsToMany(Stream, {
  through: StreamProgram,
  foreignKey: "program_id",
  otherKey: "stream_id",
  as: "streams"
});




export {
  Program,
  ProgramDegree,
  Scholarship,
  Level,
  Degree,
  Exam,
  User,
  University,
  UniversityProgram,
};
