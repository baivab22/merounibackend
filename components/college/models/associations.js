import College from "./CollegeModel.js";
import CollegeAddress from "./CollegeAddress.js";
import CollegeContact from "./CollegeContact.js";
import CollegeCourse from "./CollegeCourse.js";
import CollegeMember from "./CollegeMember.js";
import CollegeAdmission from "./CollegeAdmission.js";
import CollegeGallery from "./CollegeGallery.js";
import { University } from "../../university/model/UniversityModel.js";
import Program from "../../program/model/ProgramModel.js";
import User from "../../users/model/UserModel.js";
import CollegeFacility from "./CollegeFacility.js";

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
  as: "collegeFacility",
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

export {
  College,
  CollegeAddress,
  CollegeAdmission,
  CollegeContact,
  CollegeCourse,
  CollegeMember,
  CollegeFacility,
  Program,
  University,
  User,
};
