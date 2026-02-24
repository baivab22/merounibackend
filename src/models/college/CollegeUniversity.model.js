import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import College from "./College.model.js";
import { University } from "../university/University.model.js";

class CollegeUniversity extends Model { }

CollegeUniversity.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        college_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: College, key: "id" },
            onDelete: "CASCADE",
        },
        university_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: University, key: "id" },
            onDelete: "CASCADE",
        },
    },
    {
        sequelize,
        modelName: "college_universities",
        tableName: "college_universities",
        timestamps: true
    }
);

export default CollegeUniversity;
