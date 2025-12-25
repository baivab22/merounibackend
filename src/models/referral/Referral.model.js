import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import College from "../college/College.model.js";
import User from "../users/User.model.js";
import Course from "../courses/Course.model.js";

class Referral extends Model {}

Referral.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    college_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: College,
        key: "id",
      },
    },
    teacher_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    application_type: {
      type: DataTypes.ENUM("self", "referred"),
      allowNull: false,
    },
    // New flatten fields so we don't need a separate ReferralStudent model
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    student_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    student_phone_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    student_email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    student_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Course,
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("IN_PROGRESS", "ACCEPTED", "REJECTED"),
      allowNull: false,
      defaultValue: "IN_PROGRESS",
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    freezeTableName: true,
    modelName: "referral",
  }
);

// Associations
Referral.belongsTo(College, {
  foreignKey: "college_id",
  as: "referralCollege",
});

Referral.belongsTo(User, {
  foreignKey: "teacher_id",
  as: "referralTeacher",
});

Referral.belongsTo(Course, {
  foreignKey: "course_id",
  as: "course",
});

export default Referral;
