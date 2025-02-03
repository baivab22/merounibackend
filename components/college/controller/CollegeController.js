import College from "../models/CollegeModel.js";
import CollegeAddress from "../models/CollegeAddress.js";
import CollegeContact from "../models/CollegeContact.js";
import CollegeCourse from "../models/CollegeCourse.js";
import CollegeMember from "../models/CollegeMember.js";
import CollegeAdmission from "../models/CollegeAdmission.js";
import Program from "../../program/model/ProgramModel.js";
import User from "../../users/model/UserModel.js";
import { University } from "../../university/model/UniversityModel.js";

// Get All Colleges
export const getColleges = async (req, res) => {
  try {
    const items = await College.findAll();
    return res.status(200).json({
      message: "success",
      items
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCollegeById = async (req, res) => {
  try {
    const { collegeId } = req.params;

    const college = await College.findOne({
      where: { id: collegeId },
      include: [
        {
          model: CollegeAddress,
          as: "address",
          attributes: ["country", "state", "city", "street", "postal_code"],
        },
        {
          model: CollegeContact,
          as: "contacts",
          attributes: ["contact_number"],
        },
        {
          model: CollegeCourse,
          as: "courses",
          include: [
            {
              model: Program,
              as: "programDetails",
              attributes: ["id", "title", "slug", "duration", "credits"],
            },
          ],
        },
        {
          model: CollegeMember,
          as: "members",
          attributes: ["name", "contact_number", "role", "description"],
        },
        {
          model: CollegeAdmission,
          as: "admissions",
          include: [
            {
              model: Program,
              as: "admissionProgram",
              attributes: ["id", "title"],
            },
          ],
        },
        {
          model: University,
          as: "university",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "authorDetails",
          attributes: ["id", "first_name", "email"],
        },
      ],
    });

    if (!college) {
      return res.status(404).json({ error: "College not found!" });
    }

    res.status(200).json({ college });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
