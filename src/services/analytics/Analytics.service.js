import UserModel from "../../models/users/User.model.js";
import College from "../../models/college/College.model.js";
import Event from "../../models/events/Event.model.js";
import Referral from "../../models/referral/Referral.model.js";
import { University } from "../../models/university/University.model.js";
import Consultancy from "../../models/consultancy/Consultancy.model.js";
import { Sequelize } from "sequelize";

class AnalyticsService {
  async getAdminOverview() {
    const [
      totalUsers,
      totalColleges,
      totalEvents,
      totalReferrals,
      totalAgents,
      totalUniversities,
      totalConsultancies,
    ] = await Promise.all([
      UserModel.count(),
      College.count(),
      Event.count(),
      Referral.count(),
      UserModel.count({
        where: Sequelize.literal(
          `JSON_UNQUOTE(JSON_EXTRACT(roles, '$.agent')) = 'true'`
        ),
      }),
      University.count(),
      Consultancy.count(),
    ]);

    const educationalInstitutions = [
      { name: "Colleges", value: totalColleges },
      { name: "Universities", value: totalUniversities },
      { name: "Consultancies", value: totalConsultancies },
    ];

    const studentEnrollmentGrowth = [
      { name: "Jan", enrolled: 1000 },
      { name: "Feb", enrolled: 1200 },
      { name: "Mar", enrolled: 1500 },
      { name: "Apr", enrolled: 2000 },
      { name: "May", enrolled: 2300 },
      { name: "Jun", enrolled: 2600 },
      { name: "Jul", enrolled: 2800 },
      { name: "Aug", enrolled: 3000 },
      { name: "Sep", enrolled: 3500 },
      { name: "Oct", enrolled: 3700 },
      { name: "Nov", enrolled: 3900 },
      { name: "Dec", enrolled: 4000 },
    ];

    return {
      totalUsers,
      totalColleges,
      totalEvents,
      totalReferrals,
      totalAgents,
      educationalInstitutions,
      studentEnrollmentGrowth,
    };
  }
}

export default AnalyticsService;
