// import College from "./college.js";
// import CollegeAddress from "./CollegeAddress.js";
// import CollegeContact from "./CollegeContact.js";
// import CollegeCourse from "./CollegeCourse.js";
// import CollegeMember from "./CollegeMember.js";
// import CollegeAdmission from "./CollegeAdmission.js";

// // Define associations here
// College.hasOne(CollegeAddress, {
//   foreignKey: "college_id",
//   onDelete: "CASCADE",
// });
// CollegeAddress.belongsTo(College, {
//   foreignKey: "college_id",
//   onDelete: "CASCADE",
// });

// College.hasMany(CollegeContact, {
//   foreignKey: "college_id",
//   onDelete: "CASCADE",
// });
// CollegeContact.belongsTo(College, {
//   foreignKey: "college_id",
//   onDelete: "CASCADE",
// });

// College.hasMany(CollegeMember, {
//   foreignKey: "college_id",
//   onDelete: "CASCADE",
// });
// CollegeMember.belongsTo(College, {
//   foreignKey: "college_id",
//   onDelete: "CASCADE",
// });

// College.hasMany(CollegeAdmission, {
//   foreignKey: "college_id",
//   onDelete: "CASCADE",
// });
// CollegeAdmission.belongsTo(College, {
//   foreignKey: "college_id",
//   onDelete: "CASCADE",
// });

// College.belongsToMany(CollegeCourse, {
//   through: "college_courses",
//   foreignKey: "college_id",
// });
// CollegeCourse.belongsTo(College, {
//   foreignKey: "college_id",
//   onDelete: "CASCADE",
// });

// export default function setupAssociations() {
//   console.log("Associations are set up!");
// }
