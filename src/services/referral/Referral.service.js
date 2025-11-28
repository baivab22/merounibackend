import Referral from "../../models/referral/Referral.model.js";
import ReferralStudent from "../../models/referral/ReferralStudent.model.js";
import College from "../../models/college/College.model.js";
import UserModel from "../../models/users/User.model.js";

class ReferralService {
  async createReferredApplication(payload) {
    const applications = Array.isArray(payload) ? payload : [payload];

    for (const application of applications) {
      const { college_id, teacher_id, students = [] } = application;

      if (!college_id) {
        const error = new Error("College ID is required");
        error.status = 400;
        throw error;
      }

      if (!Array.isArray(students) || students.length === 0) {
        const error = new Error("Students array is required");
        error.status = 400;
        throw error;
      }

      if (teacher_id) {
        const teacherExists = await UserModel.findOne({
          where: { id: teacher_id },
        });

        if (!teacherExists) {
          const error = new Error("Invalid teacher ID");
          error.status = 400;
          throw error;
        }
      }

      const referral = await Referral.create({
        college_id,
        teacher_id,
        application_type: "referred",
      });

      const studentRecords = students.map((student) => ({
        referral_id: referral.id,
        student_name: student.student_name,
        student_phone_no: student.student_phone_no,
        student_email: student.student_email,
        student_description: student.student_description,
      }));

      await ReferralStudent.bulkCreate(studentRecords);
    }
  }

  async createSelfApplication(payload) {
    const {
      college_id,
      student_name,
      student_phone_no,
      student_email,
      student_description,
    } = payload;

    const existing = await ReferralStudent.findOne({
      where: { student_email },
    });

    if (existing) {
      const error = new Error("Already received your email");
      error.status = 400;
      throw error;
    }

    const referral = await Referral.create({
      college_id,
      application_type: "self",
    });

    return ReferralStudent.create({
      referral_id: referral.id,
      student_name,
      student_phone_no,
      student_email,
      student_description,
    });
  }

  async getApplications(user) {
    const whereCondition = {};

    if (user?.role === "agent") {
      whereCondition.teacher_id = user.id;
    }

    return Referral.findAll({
      where: whereCondition,
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
  }

  async getUserReferrals(user) {
    const whereCondition = {};

    if (user?.role === "agent") {
      whereCondition.teacher_id = user.id;
    } else if (user?.role === "student") {
      whereCondition.application_type = "self";
    }

    return Referral.findAll({
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
  }

  async getApplicationsByType(type) {
    this.validateApplicationType(type);
    return Referral.findAll({
      where: { application_type: type },
      include: [ReferralStudent],
    });
  }

  async getCollegeApplications(college_id) {
    await this.ensureCollegeExists(college_id);
    return Referral.findAll({
      where: { college_id },
      include: [ReferralStudent],
    });
  }

  async getCollegeApplicationsByType(college_id, type) {
    this.validateApplicationType(type);
    await this.ensureCollegeExists(college_id);
    return Referral.findAll({
      where: { college_id, application_type: type },
      include: [ReferralStudent],
    });
  }

  validateApplicationType(type) {
    if (!["self", "referred"].includes(type)) {
      const error = new Error("Invalid application type");
      error.status = 400;
      throw error;
    }
  }

  async ensureCollegeExists(college_id) {
    const college = await College.findByPk(college_id);
    if (!college) {
      const error = new Error("College not found");
      error.status = 404;
      throw error;
    }
  }
}

export default ReferralService;
