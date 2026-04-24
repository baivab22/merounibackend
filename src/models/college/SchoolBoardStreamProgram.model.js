import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import College from "./College.model.js";
import Board from "../board/Board.model.js";
import Stream from "../stream/Stream.model.js";
import Program from "../program/Program.model.js";

class SchoolBoardStreamProgram extends Model {}

SchoolBoardStreamProgram.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // i.e. school_id
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: College, key: "id" },
      onDelete: "CASCADE",
    },
    board_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: Board, key: "id" },
      onDelete: "CASCADE",
    },
    stream_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Stream, key: "id" },
      onDelete: "CASCADE",
    },
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: Program, key: "id" },
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    modelName: "SchoolBoardStreamProgram",
    tableName: "schools_board_streams_and_programs",
    timestamps: true,
    indexes: [
      {
        name: "idx_school_board_stream_program_unique",
        unique: true,
        fields: ["college_id", "board_id", "stream_id", "program_id"],
      },
    ],
  },
);

export default SchoolBoardStreamProgram;
