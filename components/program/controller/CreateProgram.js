import slug from "slug";
import { sequelize } from "../../../config/database.js";
import Program from "../model/ProgramModel.js";
import Faculty from "../../faculty/model/FacultyModel.js";
import Scholarship from "../../scholarship/model/ScholarshipModel.js";
import Level from "../../level/model/LevelModel.js";
import { Exam } from "../../exams/model/ExamModel.js";

export const createOrUpdateProgram = async (req, res) => {
  const t = await sequelize.transaction(); // Start transaction

  try {
    const {
      id,
      title,
      author,
      faculty_id,
      duration,
      credits,
      level_id,
      language,
      eligibility_criteria,
      fee,
      scholarship_id,
      curriculum,
      learning_outcomes,
      delivery_type,
      delivery_mode,
      careers,
      exam_id,
    } = req.body;

    let programId = id;

    // 1️⃣ Validate Foreign Keys Exist
    if (!(await Faculty.findByPk(faculty_id))) {
      return res.status(400).json({ error: "Invalid faculty_id" });
    }
    if (!(await Level.findByPk(level_id))) {
      return res.status(400).json({ error: "Invalid level_id" });
    }
    if (scholarship_id && !(await Scholarship.findByPk(scholarship_id))) {
      return res.status(400).json({ error: "Invalid scholarship_id" });
    }
    if (exam_id && !(await Exam.findByPk(exam_id))) {
      return res.status(400).json({ error: "Invalid exam_id" });
    }

    if (!programId) {
      // 2️⃣ Check for Duplicate Title
      const existingProgram = await Program.findOne({ where: { title } });
      if (existingProgram) {
        return res.status(400).json({ error: "Program title already exists" });
      }

      // 3️⃣ CREATE PROGRAM
      const newProgram = await Program.create(
        {
          title,
          slugs: slug(title),
          author,
          faculty_id,
          duration,
          credits,
          level_id,
          language,
          eligibility_criteria,
          fee,
          scholarship_id,
          curriculum,
          learning_outcomes,
          delivery_type,
          delivery_mode,
          careers,
          exam_id,
        },
        { transaction: t }
      );

      programId = newProgram.id;
    } else {
      // 4️⃣ UPDATE PROGRAM
      const existingProgram = await Program.findByPk(programId);
      if (!existingProgram) {
        return res.status(404).json({ error: "Program not found" });
      }

      await Program.update(
        {
          title,
          slugs: slug(title),
          author,
          faculty_id,
          duration,
          credits,
          level_id,
          language,
          eligibility_criteria,
          fee,
          scholarship_id,
          curriculum,
          learning_outcomes,
          delivery_type,
          delivery_mode,
          careers,
          exam_id,
        },
        { where: { id: programId }, transaction: t }
      );
    }

    await t.commit(); // Commit transaction
    res.status(200).json({
      message: programId ? "Program updated successfully!" : "Program created successfully!",
      programId,
    });
  } catch (error) {
    await t.rollback(); // Rollback on error
    console.error("Sequelize Validation Error:", error.errors);
    res.status(500).json({ error: error.message });
  }
};
