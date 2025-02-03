import slug from "slug";

import { Exam, ExamDetail, ApplicationDetail } from "../model/ExamModel.js";
import { sequelize } from "../../../config/database.js";

export const createOrUpdateExam = async (req, res) => {
  const t = await sequelize.transaction(); // Start transaction
  try {
    const {
      id, // If present, update; otherwise, create new
      title,
      description,
      author,
      level_id,
      affiliation,
      syllabus,
      pastQuestion,
      examDetails, // [{ exam_type, full_marks, pass_marks, ... }]
      applicationDetails, // { normal_fee, late_fee, exam_date, ... }
    } = req.body;

    let examId = id;
    let slugs = slug(title);

    if (!examId) {
      // Create Exam
      const exam = await Exam.create(
        {
          title,
          slugs,
          description,
          author,
          level_id,
          affiliation,
          syllabus,
          pastQuestion,
        },
        { transaction: t }
      );
      examId = exam.id;
    } else {
      // Update Exam
      await Exam.update(
        {
          title,
          slugs,
          description,
          author,
          level_id,
          affiliation,
          syllabus,
          pastQuestion,
        },
        { where: { id: examId }, transaction: t }
      );
    }

    // Handle Exam Details (Clear old & Insert new)
    if (examDetails && examDetails.length > 0) {
      await ExamDetail.destroy({ where: { exam_id: examId }, transaction: t });

      await ExamDetail.bulkCreate(
        examDetails.map((detail) => ({
          exam_id: examId,
          ...detail,
        })),
        { transaction: t }
      );
    }

    // Handle Application Details (Clear old & Insert new)
    if (applicationDetails) {
      await ApplicationDetail.destroy({
        where: { exam_id: examId },
        transaction: t,
      });

      await ApplicationDetail.create(
        {
          exam_id: examId,
          ...applicationDetails,
        },
        { transaction: t }
      );
    }

    await t.commit();
    res.status(200).json({
      message: examId
        ? "Exam updated successfully!"
        : "Exam created successfully!",
    });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({
      error: error.message,
    });
  }
};
