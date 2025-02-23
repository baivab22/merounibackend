import { Op, Sequelize } from "sequelize";
import UserModel from "../model/UserModel.js";
import { Parser } from "json2csv";

export const ExportUsers = async (req, res) => {
  try {
    let limit = parseInt(req.query.limit) || 100;
    let startDate = req.query.start_date; 
    let endDate = req.query.end_date; 
    let roleFilter = req.query.role;

    let whereCondition = {};

    if (startDate || endDate) {
      whereCondition.createdAt = {};
      if (startDate) {
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0); // Start of the day (00:00:00)
        whereCondition.createdAt[Op.gte] = startOfDay;
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999); // End of the day (23:59:59.999)
        whereCondition.createdAt[Op.lte] = endOfDay;
      }
    }

    if (roleFilter) {
      whereCondition[Op.and] = [
        Sequelize.literal(
          `JSON_UNQUOTE(JSON_EXTRACT(roles, '$.${roleFilter}')) = 'true'`
        ),
      ];
    }

    // Fetch the users from the database
    const users = await UserModel.findAll({
      where: whereCondition,
      limit: limit,
      attributes: [
        "firstName",
        "middleName",
        "lastName",
        "email",
        "phoneNo",
        [Sequelize.fn("DATE", Sequelize.col("createdAt")), "createdAt"],
      ],
    });

    // Define the fields for the CSV with custom titles
    const fields = [
      { label: "First Name", value: "firstName" },
      { label: "Middle Name", value: "middleName" },
      { label: "Last Name", value: "lastName" },
      { label: "E-mail", value: "email" },
      { label: "Phone No.", value: "phoneNo" },
      { label: "Registered Date", value: "createdAt" },
    ];

    // Create a JSON2CSV parser with custom fields
    const json2csvParser = new Parser({ fields });

    // Convert the users data to CSV
    const csv = json2csvParser.parse(users);

    // Set the headers for the response
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=users.csv");

    // Send the CSV file as a response
    return res.status(200).send(csv);
  } catch (error) {
    console.error("Error in exportUsers:", error);
    return res.status(500).json({
      message: `Server Error: ${error.message}`,
    });
  }
};
