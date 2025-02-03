import Program from "../model/ProgramModel.js";

// Delete Program
export const deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;
    await Program.destroy({ where: { id } });

    res.status(200).json({ message: "Program deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
