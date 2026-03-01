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
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        order_no_for_website: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null,
            field: "order_no_for_website",
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
