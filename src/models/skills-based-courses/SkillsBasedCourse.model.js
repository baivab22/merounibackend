import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class SkillsBasedCourse extends Model { }

SkillsBasedCourse.init(
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
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        thumbnail_image: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true,
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_featured: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        likes_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        institution_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

    },
    {
        sequelize,
        modelName: "SkillsBasedCourse",
        tableName: "skills_based_courses",
        timestamps: true,
    }
);

export default SkillsBasedCourse;
