import UserModel from "../../models/users/User.model.js";
import College from "../../models/college/College.model.js";
import Event from "../../models/events/Event.model.js";
import Referral from "../../models/referral/Referral.model.js";
import { University } from "../../models/university/University.model.js";
import Consultancy from "../../models/consultancy/Consultancy.model.js";
import Blog from "../../models/blogs/Blog.model.js";
import { Sequelize, QueryTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class AnalyticsService {
  async getAdminOverview(query = {}) {
    const [
      totalUsers,
      totalColleges,
      totalEvents,
      totalReferrals,
      totalAgents,
      totalUniversities,
      totalConsultancies,
      totalBlogs,
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
      Blog.count(),
    ]);

    const educationalInstitutions = [
      { name: "Colleges", value: totalColleges },
      { name: "Universities", value: totalUniversities },
      { name: "Consultancies", value: totalConsultancies },
    ];

    // Get available years (from earliest referral to current year)
    const yearsData = await sequelize.query(
      `
      SELECT DISTINCT YEAR(createdAt) as year
      FROM referral
      ORDER BY year DESC
      `,
      {
        type: QueryTypes.SELECT,
      }
    );

    const currentYear = new Date().getFullYear();
    const availableYears =
      yearsData.length > 0 ? yearsData.map((item) => item.year) : [currentYear];

    // Get selected years from query, default to current year if not provided
    let selectedYears = query.years
      ? Array.isArray(query.years)
        ? query.years.map((y) => parseInt(y, 10))
        : [parseInt(query.years, 10)]
      : [currentYear];

    // Ensure selected years are valid
    selectedYears = selectedYears.filter((year) =>
      availableYears.includes(year)
    );

    // If no valid years selected, use current year (or first available year)
    if (selectedYears.length === 0) {
      selectedYears =
        availableYears.length > 0 ? [availableYears[0]] : [currentYear];
    }

    // Get enrollment data for all selected years
    const enrollmentDataByYear = await Promise.all(
      selectedYears.map(async (year) => {
        const data = await sequelize.query(
          `
          SELECT 
            DATE_FORMAT(createdAt, '%b') as month_name,
            MONTH(createdAt) as month_num,
            COUNT(*) as enrolled
          FROM referral
          WHERE YEAR(createdAt) = :year
          GROUP BY MONTH(createdAt), DATE_FORMAT(createdAt, '%b')
          ORDER BY month_num ASC
          `,
          {
            replacements: { year },
            type: QueryTypes.SELECT,
          }
        );
        return { year, data };
      })
    );

    // Create a map of month names to their abbreviations
    const monthMap = {
      1: "Jan",
      2: "Feb",
      3: "Mar",
      4: "Apr",
      5: "May",
      6: "Jun",
      7: "Jul",
      8: "Aug",
      9: "Sep",
      10: "Oct",
      11: "Nov",
      12: "Dec",
    };

    // Create array for all 12 months with enrollment data for each selected year
    const studentEnrollmentGrowth = Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const monthData = {
        name: monthMap[monthNum],
      };

      enrollmentDataByYear.forEach(({ year, data }) => {
        const monthEntry = data.find((item) => item.month_num === monthNum);
        monthData[`enrolled_${year}`] = monthEntry
          ? parseInt(monthEntry.enrolled, 10)
          : 0;
      });

      return monthData;
    });

    return {
      totalUsers,
      totalColleges,
      totalEvents,
      totalReferrals,
      totalAgents,
      totalUniversities,
      totalConsultancies,
      totalBlogs,
      educationalInstitutions,
      studentEnrollmentGrowth,
      availableYears:
        availableYears.length > 0 ? availableYears : [currentYear],
      selectedYears,
    };
  }
}

export default AnalyticsService;
