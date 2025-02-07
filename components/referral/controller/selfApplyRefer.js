import Referral from "../model/ReferralModel.js";
import ReferralStudent from "../model/ReferralStudent.js";

export const createSelfApplication = async (req, res) => {
  try {
    const {
      college_id,
      student_name,
      student_phone_no,
      student_email,
      student_description,
    } = req.body;

    // search email exists or not
    let item = await ReferralStudent.findOne({
      where: {
        student_email,
      },
    });

    if(item){
      return res.status(400).json({
        message: "Already received you mail"
      })
    }

    // Create application (without teacher_id)
    const referral = await Referral.create({
      college_id,
      application_type: "self",
    });

    // Add student to application
    const student = await ReferralStudent.create({
      referral_id: referral.id,
      student_name,
      student_phone_no,
      student_email,
      student_description,
    });

    return res
      .status(201)
      .json({ message: "Self-application submitted successfully", student });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
