import Referral from "../model/ReferralModel.js";
import ReferralStudent from "../model/ReferralStudent.js";

export const createReferredApplication = async (req, res) => {
  try {
    const { college_id, teacher_id, students } = req.body;

    // Create application with teacher reference
    const application = await Referral.create({
      college_id,
      teacher_id,
      application_type: "referred",
    });

    // Insert multiple students
    const studentRecords = students.map((student) => ({
      application_id: application.id,
      student_name: student.student_name,
      student_phone_no: student.student_phone_no,
      student_email: student.student_email,
      student_document: student.student_document,
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
