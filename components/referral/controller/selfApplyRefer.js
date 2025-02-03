import Referral from "../model/ReferralModel.js";
import ReferralStudent from "../model/ReferralStudent.js";

export const createSelfApplication = async (req, res) => {
  try {
    const {
      college_id,
      student_name,
      student_phone_no,
      student_email,
      student_document,
    } = req.body;

    // Create application (without teacher_id)
    const application = await Referral.create({
      college_id,
      application_type: "self",
    });

    // Add student to application
    const student = await ReferralStudent.create({
      application_id: application.id,
      student_name,
      student_phone_no,
      student_email,
      student_document,
    });

    return res
      .status(201)
      .json({ message: "Self-application submitted successfully", student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
