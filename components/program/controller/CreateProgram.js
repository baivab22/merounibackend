import slug from "slug";
import { sequelize } from "../../../config/database.js";
import Program from "../model/ProgramModel.js";

export const createOrUpdateProgram = async (req, res) => {
  const t = await sequelize.transaction(); // Start transaction

  try {
    const {
      id, // If present, update the program; otherwise, create a new one
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

    if (!programId) {
      //  CREATE PROGRAM
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
      //  UPDATE PROGRAM
      await Program.update(
        {
          title,
          slugs,
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
    res.status(500).json({ error: error.message });
  }
};
