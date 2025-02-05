import College from "../models/CollegeModel.js";
import CollegeAddress from "../models/CollegeAddress.js";
import CollegeContact from "../models/CollegeContact.js";
import CollegeCourse from "../models/CollegeCourse.js";
import CollegeMember from "../models/CollegeMember.js";
import CollegeAdmission from "../models/CollegeAdmission.js";
import Program from "../../program/model/ProgramModel.js";
import User from "../../users/model/UserModel.js";
import Course from "../../courses/model/CourseModel.js";
import { University } from "../../university/model/UniversityModel.js";

// Get All Colleges
export const getColleges = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    let sort = req.query.sort || "asc";

    let search = req.query.q || "";
    let isFeatured = req.query.is_featured;
    let pinned = req.query.pinned;

    const offset = (page - 1) * limit;

    let whereCondition = {};
    if (search) {
      whereCondition.name = { [Op.like]: `%${search}%` };
    }

    if (isFeatured !== undefined) {
      whereCondition.isFeatured = isFeatured === "true" ? 1 : 0;
    }

    if (pinned !== undefined) {
      whereCondition.pinned = pinned === "true" ? 1 : 0;
    }

    const { count: totalCount, rows: items } = await College.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["id", sort.toUpperCase()]],
      include: [
        {
          model: CollegeAddress,
          as: "address",
          attributes: ["country", "state", "city"],
        },
      ],
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      message: "success",
      items,
      pagination: { currentPage: page, totalPages, limit, totalCount },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCollegeById = async (req, res) => {
  try {
    const { slugs } = req.params;

    const college = await College.findOne({
      where: { slugs },
      attributes: {
        exclude: ["author_id", "university_id"],
      },
      include: [
        {
          model: CollegeAddress,
          as: "collegeAddress",
          attributes: ["country", "state", "city", "street", "postal_code"],
        },
        {
          model: CollegeContact,
          as: "collegeContacts",
          attributes: ["contact_number"],
        },
        {
          model: CollegeCourse,
          as: "collegeCourses",
          attributes: {
            exclude: ["id", "college_id", "course_id"],
          },
          include: [
            {
              model: Program,
              as: "program",
              attributes: ["title", "slugs"],
            },
          ],
        },
        {
          model: CollegeMember,
          as: "collegeMembers",
          attributes: ["name", "contact_number", "role", "description"],
        },
        {
          model: CollegeAdmission,
          as: "collegeAdmissions",
          attributes: {
            exclude: ["id", "college_id", "course_id"],
          },
          include: [
            {
              model: Program,
              as: "program",
              attributes: ["title", "slugs"],
            },
          ],
        },
        {
          model: University,
          as: "university",
          attributes: ["fullname", "slugs"],
        },
        {
          model: User,
          as: "authorDetails",
          attributes: ["firstName", "middleName", "lastName"],
        },
      ],
    });

    if (!college) {
      return res.status(404).json({ error: "College not found!" });
    }

    return res.status(200).json({ item: college });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
