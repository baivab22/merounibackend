import Referral from "../model/ReferralModel.js";
import ReferralStudent from "../model/ReferralStudent.js";
import College from "../../college/models/CollegeModel.js";
import UserModel from "../../users/model/UserModel.js";

export const getApplications = async (req, res) => {
  try {
    if (req.user.role === "agent") {
      whereCondition.referral_teacher_id = req.body.user_id; 
    }
    const applications = await Referral.findAll({
      include: [
        {
          model: ReferralStudent,
          as: "referralStudents",
        },
        {
          model: UserModel,
          as: "referralTeacher",
          attributes: ["firstName", "middleName", "lastName"],
        },
        {
          model: College,
          as: "referralCollege",
          attributes: ["name", "slugs"],
        },
      ],
    });

    return res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserReferrals = async (req, res) => {
  try {
    let whereCondition = {}; 

    if (req.user.role === "agent") {
      whereCondition.teacher_id = req.user.id;
    } else if (req.user.role === "student") {
      whereCondition.application_type = "self"; 
    }

    const referrals = await Referral.findAll({
      where: whereCondition,
      include: [
        {
          model: ReferralStudent,
          as: "referralStudents",
          attributes: ["student_name", "student_phone_no", "student_email"],
        },
        {
          model: College,
          as: "referralCollege",
          attributes: ["name", "slugs"],
        },
      ],
    });

    return res.status(200).json(referrals);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getApplicationsByType = async (req, res) => {
  try {
    const { type } = req.params;
    if (!["self", "referred"].includes(type)) {
      return res.status(400).json({ error: "Invalid application type" });
    }

    const applications = await Referral.findAll({
      where: { application_type: type },
      include: [ReferralStudent],
    });

    return res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all referrals (applications) for a specific college
export const getCollegeApplications = async (req, res) => {
  try {
    const { college_id } = req.params;

    // Check if college exists
    const college = await College.findByPk(college_id);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    // Get all applications related to this college
    const applications = await Referral.findAll({
      where: { college_id },
      include: [ReferralStudent],
    });

    return res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get referrals by type (self-applied or teacher-referred)
export const getCollegeApplicationsByType = async (req, res) => {
  try {
    const { college_id, type } = req.params;

    if (!["self", "referred"].includes(type)) {
      return res.status(400).json({ error: "Invalid application type" });
    }

    // Check if college exists
    const college = await College.findByPk(college_id);
    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    // Fetch applications of given type for this college
    const applications = await Referral.findAll({
      where: { college_id, application_type: type },
      include: [ReferralStudent],
    });

    return res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
