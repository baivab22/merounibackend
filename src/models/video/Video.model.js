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
        status: {
            type: DataTypes.ENUM("active", "inactive"),
            defaultValue: "active",
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Video",
        tableName: "videos",
        timestamps: true,
    }
);

export default Video;
