import College from "./College.model.js";
import CollegeAddress from "./CollegeAddress.model.js";
import CollegeContact from "./CollegeContact.model.js";
import CollegeCourse from "./CollegeCourse.model.js";
import CollegeMember from "./CollegeMember.model.js";
import CollegeAdmission from "./CollegeAdmission.model.js";
import CollegeGallery from "./CollegeGallery.model.js";
import CollegeRanking from "./CollegeRanking.model.js";
import { University } from "../university/University.model.js";
import Program from "../program/Program.model.js";
import User from "../users/User.model.js";
import CollegeFacility from "./CollegeFacility.model.js";

// College Associations
College.belongsTo(User, { foreignKey: "author_id", as: "authorDetails" });
College.belongsTo(University, {
  foreignKey: "university_id",
  as: "university",
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
College.hasMany(CollegeCourse, {
  foreignKey: "college_id",
  as: "collegeCourses",
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

// CollegeCourse Associations
CollegeCourse.belongsTo(College, {
  foreignKey: "college_id",
  as: "collegeCourseCollege",
});
CollegeCourse.belongsTo(Program, { foreignKey: "course_id", as: "program" });

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
CollegeAdmission.belongsTo(Program, { foreignKey: "course_id", as: "program" });

// CollegeRanking Associations
CollegeRanking.belongsTo(College, {
  foreignKey: "college_id",
  as: "college",
});
CollegeRanking.belongsTo(Program, {
  foreignKey: "program_id",
  as: "program",
});
College.hasMany(CollegeRanking, {
  foreignKey: "college_id",
  as: "collegeRankings",
});
Program.hasMany(CollegeRanking, {
  foreignKey: "program_id",
  as: "programRankings",
});

export {
  College,
  CollegeAddress,
  CollegeAdmission,
  CollegeContact,
  CollegeCourse,
  CollegeMember,
  CollegeFacility,
  CollegeRanking,
  Program,
  University,
  User,
};
