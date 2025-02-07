import Referral from "./ReferralModel.js";
import ReferralStudent from "./ReferralStudent.js";
import College from "../../college/models/CollegeModel.js";
import User from "../../users/model/UserModel.js";

// Define Associations
Referral.belongsTo(College, { foreignKey: "college_id", as: "referralCollege" });
Referral.belongsTo(User, { foreignKey: "teacher_id", as: "referralTeacher" });
Referral.hasMany(ReferralStudent, { foreignKey: "referral_id", as: "referralStudents" });

ReferralStudent.belongsTo(Referral, { foreignKey: "referral_id" });

export default { Referral, ReferralStudent };
