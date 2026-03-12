import College from "./College.model.js";
import CollegeAddress from "./CollegeAddress.model.js";
import CollegeContact from "./CollegeContact.model.js";
import CollegeProgram from "./CollegeProgram.model.js";
import CollegeMember from "./CollegeMember.model.js";
import CollegeAdmission from "./CollegeAdmission.model.js";
import CollegeGallery from "./CollegeGallery.model.js";
import CollegeRanking from "./CollegeRanking.model.js";
import { University } from "../university/University.model.js";
import Program from "../program/Program.model.js";
import User from "../users/User.model.js";
import CollegeFacility from "./CollegeFacility.model.js";
import Degree from "../degree/Degree.model.js";
import CollegeOfferingDegrees from "./CollegeOfferingDegrees.model.js";
import CollegeUniversity from "./CollegeUniversity.model.js";


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
College.hasMany(CollegeProgram, {
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
College.hasMany(CollegeAdmission, {
  foreignKey: "college_id",
  as: "collegeAdmissions",
});
College.belongsToMany(Program, {
  through: CollegeProgram,
  foreignKey: "college_id",
  as: "programs",
});
Program.belongsToMany(College, {
  through: CollegeProgram,
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

// CollegeProgram Associations
CollegeProgram.belongsTo(College, {
  foreignKey: "college_id",
  as: "collegeProgramCollege",
});
CollegeProgram.belongsTo(Program, { foreignKey: "program_id", as: "program" });

// CollegeMember Associations
CollegeMember.belongsTo(College, {
  foreignKey: "college_id",
  as: "collegeMemberCollege",
});

// CollegeAdmission Associations
CollegeAdmission.belongsTo(College, {
  foreignKey: "college_id",
  as: "collegeAdmissionCollege",
});
CollegeAdmission.belongsTo(Program, { foreignKey: "program_id", as: "program" });

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
  CollegeAdmission,
  CollegeContact,
  CollegeProgram,
  CollegeMember,
  CollegeFacility,
  CollegeRanking,
  CollegeUniversity,
  Program,

  University,
  User,
};
