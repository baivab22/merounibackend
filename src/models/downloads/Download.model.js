import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import UserModel from "../users/User.model.js";

class Download extends Model { }

Download.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        fileName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "file_name",
        },
        downloadType: {
            type: DataTypes.STRING,
            allowNull: false,
            field: "download_type",
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "user_id",
            references: {
                model: "mu_users",
                key: "id",
            },
        },
        ipAddress: {
            type: DataTypes.STRING,
            allowNull: true,
            field: "ip_address",
        },
        userAgent: {
            type: DataTypes.TEXT,
            allowNull: true,
            field: "user_agent",
        },
    },
    {
        sequelize,
        modelName: "downloads",
        freezeTableName: true,
        timestamps: true,
    }
);

Download.belongsTo(UserModel, {
    foreignKey: "user_id",
    as: "user",
});

export default Download;
