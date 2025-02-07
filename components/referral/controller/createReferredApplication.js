import Referral from "../model/ReferralModel.js";
import ReferralStudent from "../model/ReferralStudent.js";
import UserModel from "../../users/model/UserModel.js";

export const createReferredApplication = async (req, res) => {
  try {
    const { college_id, teacher_id, students } = req.body;

    const teacherExists = await UserModel.findOne({ where: { id: teacher_id } });

    if (teacher_id && !teacherExists) {
      return res.status(400).json({ message: "Invalid teacher ID" });
    }

    // Create application with teacher reference
    const application = await Referral.create({
      college_id,
      teacher_id,
      application_type: "referred",
    });

    // Insert multiple students
    const studentRecords = students.map((student) => ({
      referral_id: application.id,
      student_name: student.student_name,
      student_phone_no: student.student_phone_no,
      student_email: student.student_email,
      student_description: student.student_description,
    }));

    await ReferralStudent.bulkCreate(studentRecords);

    return res
      .status(201)
      .json({ message: "Referred application submitted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
