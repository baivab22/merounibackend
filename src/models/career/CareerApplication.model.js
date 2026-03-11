import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import CareerModel from "./Career.model.js";

class CareerApplication extends Model { }

CareerApplication.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        career_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: CareerModel,
                key: "id",
            },
            onDelete: "CASCADE",
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "mu_users",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        resume: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cover_letter: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("pending", "reviewed", "rejected", "hired"),
            allowNull: false,
            defaultValue: "pending",
        },
    },
    {
        sequelize,
        modelName: "career_application",
        freezeTableName: true,
        underscored: false,
        timestamps: true,
    }
);

export default CareerApplication;
