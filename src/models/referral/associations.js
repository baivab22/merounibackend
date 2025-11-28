import Referral from "./Referral.model.js";
import ReferralStudent from "./ReferralStudent.model.js";
import College from "../college/College.model.js";
import User from "../users/User.model.js";

// Define Associations
Referral.belongsTo(College, { foreignKey: "college_id", as: "referralCollege" });
Referral.belongsTo(User, { foreignKey: "teacher_id", as: "referralTeacher" });
Referral.hasMany(ReferralStudent, { foreignKey: "referral_id", as: "referralStudents" });

ReferralStudent.belongsTo(Referral, { foreignKey: "referral_id" });

export default { Referral, ReferralStudent };
