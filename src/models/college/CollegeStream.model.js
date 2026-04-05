import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import College from "./College.model.js";
import Stream from "../stream/Stream.model.js";

class CollegeStream extends Model { }

CollegeStream.init(
    {
        college_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: { model: College, key: "id" },
            onDelete: "CASCADE",
        },
        stream_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: { model: Stream, key: "id" },
            onDelete: "CASCADE",
        },
    },
    {
        sequelize,
        modelName: "college_streams",
        tableName: "college_streams",
        timestamps: true
    }
);

export default CollegeStream;
