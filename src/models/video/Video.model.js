import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";

class Video extends Model { }

Video.init(
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
            allowNull: false,
            unique: true,
        },
        yt_video_link: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        featured_image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        meta_description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "categories",
                key: "id",
            },
            onDelete: "SET NULL",
        },
    },
    {
        sequelize,
        modelName: "Video",
        tableName: "videos",
        timestamps: true,
    }
);

import Category from "../category/Category.model.js";

Video.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category",
});

export default Video;
