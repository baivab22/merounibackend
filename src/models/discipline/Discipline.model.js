import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class Discipline extends Model { }

Discipline.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        featured_image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("active", "inactive"),
            defaultValue: "active",
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Discipline",
        tableName: "disciplines",
        timestamps: true,
    }
);

export default Discipline;
