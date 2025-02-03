import { Exam, ExamDetail, ApplicationDetail } from "../model/ExamModel.js";
import Level from "../../level/model/LevelModel.js";
import { University } from "../../university/model/UniversityModel.js";
import UserModel from "../../users/model/UserModel.js";

export const getAllExams = async (req, res) => {
  try {
    const items = await Exam.findAll({
      include: [
        { model: Level, attributes: ["id", "title"], as: "level" },
        { model: University, attributes: ["id", "fullname"], as: "university" },
        {
          model: UserModel,
          attributes: ["id", "firstName"],
          as: "authorDetails",
        },
        { model: ExamDetail, as: "exam_details" },
        { model: ApplicationDetail, as: "application_details" },
      ],
    });

    res.status(200).json({
      message: "success",
      items,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
