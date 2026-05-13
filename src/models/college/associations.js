import College from "./College.model.js";
import CollegeAddress from "./CollegeAddress.model.js";
import CollegeContact from "./CollegeContact.model.js";
import CollegeOfferingProgram from "./CollegeOfferingProgram.model.js";
import CollegeMember from "./CollegeMember.model.js";
import Admission from "./Admission.model.js";
import CollegeGallery from "./CollegeGallery.model.js";
import CollegeRanking from "./CollegeRanking.model.js";
import CollegeRankingParent from "./CollegeRankingParent.model.js";
import { University } from "../university/University.model.js";
import Program from "../program/Program.model.js";
import User from "../users/User.model.js";
import CollegeFacility from "./CollegeFacility.model.js";
import Degree from "../degree/Degree.model.js";
import CollegeOfferingDegrees from "./CollegeOfferingDegrees.model.js";
import CollegeUniversity from "./CollegeUniversity.model.js";
import Board from "../board/Board.model.js";
import Stream from "../stream/Stream.model.js";
import SchoolBoardStreamProgram from "./SchoolBoardStreamProgram.model.js";

// College Associations
College.belongsTo(User, { foreignKey: "author_id", as: "authorDetails" });
// One-to-many relationship (Backwards compatibility or main university if needed, but the user wants multiple)
// For now, removing the belongsTo and replacing with belongsToMany
College.belongsToMany(University, {
  through: CollegeUniversity,
  foreignKey: "college_id",
  as: "universities",
});
University.belongsToMany(College, {
  through: CollegeUniversity,
  foreignKey: "university_id",
  as: "colleges",
});

// School Board Stream Program Associations
College.hasMany(SchoolBoardStreamProgram, {
  foreignKey: "college_school_id",
  as: "schoolBoardStreamPrograms",
});
SchoolBoardStreamProgram.belongsTo(College, {
  foreignKey: "college_school_id",
  as: "college",
});
SchoolBoardStreamProgram.belongsTo(Board, {
  foreignKey: "board_id",
  as: "board",
});
SchoolBoardStreamProgram.belongsTo(Stream, {
  foreignKey: "stream_id",
  as: "stream",
});
SchoolBoardStreamProgram.belongsTo(Program, {
  foreignKey: "program_id",
  as: "program",
});
Board.hasMany(SchoolBoardStreamProgram, {
  foreignKey: "board_id",
  as: "schoolBoardStreamPrograms",
});
Stream.hasMany(SchoolBoardStreamProgram, {
  foreignKey: "stream_id",
  as: "schoolBoardStreamPrograms",
});
Program.hasMany(SchoolBoardStreamProgram, {
  foreignKey: "program_id",
  as: "schoolBoardStreamPrograms",
});

College.hasOne(CollegeAddress, {
  foreignKey: "college_id",
  as: "collegeAddress",
});
College.hasMany(CollegeFacility, {
  foreignKey: "college_id",
  as: "facilities",
});
College.hasMany(CollegeContact, {
  foreignKey: "college_id",
  as: "collegeContacts",
});
College.hasMany(CollegeOfferingProgram, {
  foreignKey: "college_id",
  as: "collegePrograms",
});
College.hasMany(CollegeMember, {
  foreignKey: "college_id",
  as: "collegeMembers",
});
College.hasMany(CollegeGallery, {
  foreignKey: "college_id",
  as: "collegeGallery",
});
College.hasMany(Admission, {
  foreignKey: "school_college_id",
  as: "collegeAdmissions",
});
College.belongsToMany(Program, {
  through: CollegeOfferingProgram,
  foreignKey: "college_id",
  as: "programs",
});
Program.belongsToMany(College, {
  through: CollegeOfferingProgram,
  foreignKey: "program_id",
  as: "colleges",
});

// CollegeAddress Associations
CollegeAddress.belongsTo(College, {
  foreignKey: "college_id",
  as: "collegeAddressCollege",
});

// College Facility
CollegeFacility.belongsTo(College, {
  foreignKey: "college_id",
  as: "collegeFacilityCollege",
});

// CollegeContact Associations
CollegeContact.belongsTo(College, {
  foreignKey: "college_id",
  as: "collegeContactCollege",
});

// CollegeGallery Associations
CollegeGallery.belongsTo(College, {
  foreignKey: "college_id",
  as: "collegeGalleryCollege",
});

// CollegeOfferingProgram Associations
CollegeOfferingProgram.belongsTo(College, {
  foreignKey: "college_id",
  as: "collegeProgramCollege",
});
CollegeOfferingProgram.belongsTo(Program, {
  foreignKey: "program_id",
  as: "program",
});

// CollegeMember Associations
CollegeMember.belongsTo(College, {
  foreignKey: "college_id",
  as: "collegeMemberCollege",
});

// Admission Associations
Admission.belongsTo(College, {
  foreignKey: "school_college_id",
  as: "collegeAdmissionCollege",
});
Admission.belongsTo(Program, {
  foreignKey: "program_id",
  as: "program",
});

// CollegeRanking Associations
CollegeRanking.belongsTo(College, {
  foreignKey: "college_id",
  as: "college",
});
CollegeRanking.belongsTo(Degree, {
  foreignKey: "degree_id",
  as: "degree",
});
College.hasMany(CollegeRanking, {
  foreignKey: "college_id",
  as: "collegeRankings",
});
Degree.hasMany(CollegeRanking, {
  foreignKey: "degree_id",
  as: "degreeRankings",
});

// CollegeRankingParent Associations
CollegeRankingParent.belongsTo(Degree, {
  foreignKey: "degree_id",
  as: "degree",
});
Degree.hasOne(CollegeRankingParent, {
  foreignKey: "degree_id",
  as: "rankingParent",
});

// College Degree Many-to-Many
College.belongsToMany(Degree, {
  through: CollegeOfferingDegrees,
  foreignKey: "college_id",
  as: "degrees",
});
Degree.belongsToMany(College, {
  through: CollegeOfferingDegrees,
  foreignKey: "degree_id",
  as: "colleges",
});

export {
  College,
  CollegeAddress,
  Admission,
  CollegeContact,
  CollegeOfferingProgram,
  CollegeMember,
  CollegeFacility,
  CollegeRanking,
  CollegeUniversity,
  SchoolBoardStreamProgram,
  Program,
  University,
  Board,
  Stream,
  User,
  CollegeRankingParent,
};
