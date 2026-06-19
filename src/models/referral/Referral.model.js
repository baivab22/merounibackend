import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import College from "../college/College.model.js";
import Consultancy from "../consultancy/Consultancy.model.js";
import User from "../users/User.model.js";
import CollegeOfferingProgram from "../college/CollegeOfferingProgram.model.js";

class Referral extends Model { }

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
    referring_agent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    consultancy_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: "id",
      },
    },
    referring_consultancy_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "consultancies",
        key: "id",
      },
    },
    application_type: {
      type: DataTypes.ENUM("self", "referred"),
      allowNull: false,
    },
    // New flatten fields so we don't need a separate ReferralStudent model
    applying_student_id: {
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
    // FK to college_offering_programs.id (selected program for this college)
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "college_offering_programs",
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
  foreignKey: "referring_agent_id",
  as: "referralAgent",
});

Referral.belongsTo(User, {
  foreignKey: "consultancy_id",
  as: "referralConsultancy",
});

Referral.belongsTo(Consultancy, {
  foreignKey: "referring_consultancy_id",
  as: "referringConsultancy",
});

Referral.belongsTo(User, {
  foreignKey: "applying_student_id",
  as: "applyingStudent",
});

Referral.belongsTo(CollegeOfferingProgram, {
  foreignKey: "program_id",
  as: "collegeOfferingProgram",
});

export default Referral;
