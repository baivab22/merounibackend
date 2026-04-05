import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import College from "./College.model.js";
import Board from "../board/Board.model.js";

class CollegeBoard extends Model { }

CollegeBoard.init(
    {
        college_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: { model: College, key: "id" },
            onDelete: "CASCADE",
        },
        board_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            references: { model: Board, key: "id" },
            onDelete: "CASCADE",
        },
    },
    {
        sequelize,
        modelName: "college_boards",
        tableName: "college_boards",
        timestamps: true
    }
);

export default CollegeBoard;
