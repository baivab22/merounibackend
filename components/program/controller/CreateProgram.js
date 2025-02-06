import slug from "slug";
import { sequelize } from "../../../config/database.js";
import Program from "../model/ProgramModel.js";
import ProgramSyllabus from "../model/ProgramSyllabusModel.js";
import Faculty from "../../faculty/model/FacultyModel.js";
import Scholarship from "../../scholarship/model/ScholarshipModel.js";
import Level from "../../level/model/LevelModel.js";
import { Exam } from "../../exams/model/ExamModel.js";
import Course from "../../courses/model/CourseModel.js";
import User from "../../users/model/UserModel.js";

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
      syllabus // Array of syllabus data with year, semester, elective, and course_id
    } = req.body;

    let programId = id;

    // 1️⃣ Validate Foreign Keys Exist
    const facultyExists = await Faculty.findByPk(faculty_id);
    if (!facultyExists) {
      return res.status(400).json({ error: "Invalid faculty_id" });
    }

    const levelExists = await Level.findByPk(level_id);
    if (!levelExists) {
      return res.status(400).json({ error: "Invalid level_id" });
    }

    if (scholarship_id) {
      const scholarshipExists = await Scholarship.findByPk(scholarship_id);
      if (!scholarshipExists) {
        return res.status(400).json({ error: "Invalid scholarship_id" });
      }
    }

    if (exam_id) {
      const examExists = await Exam.findByPk(exam_id);
      if (!examExists) {
        return res.status(400).json({ error: "Invalid exam_id" });
      }
    }

    // Validate Author Exists
    const authorExists = await User.findByPk(author);
    if (!authorExists) {
      return res.status(400).json({ error: "Invalid author ID" });
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

    // 5️⃣ Handling Syllabus Data
    if (syllabus && Array.isArray(syllabus)) {
      // Remove existing syllabus if updating
      await ProgramSyllabus.destroy({ where: { program_id: programId }, transaction: t });

      const syllabusData = syllabus.map((item) => ({
        year: item.year,
        semester: item.semester,
        is_elective: item.is_elective || false,
        program_id: programId,
        course_id: item.course_id,
      }));

      // Create or update syllabus entries
      await ProgramSyllabus.bulkCreate(syllabusData, { transaction: t });
    }

    await t.commit(); // Commit transaction
    res.status(200).json({
      message: programId ? "Program updated successfully!" : "Program created successfully!",
      programId,
    });
  } catch (error) {
    await t.rollback(); // Rollback on error
    console.error("Sequelize Validation Error:", error);
    res.status(500).json({ error: error.message });
  }
};
