import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../config/database.config.js";
import Category from "../category/Category.model.js";

class MaterialCategoryOrder extends Model { }

MaterialCategoryOrder.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "categories",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: "categories",
                key: "id",
            },
            onDelete: "SET NULL",
        },
        context: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "MATERIAL",
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: "material_category_order",
        freezeTableName: true,
        timestamps: true,
    }
);

// Define associations
MaterialCategoryOrder.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category",
});

MaterialCategoryOrder.belongsTo(Category, {
    foreignKey: "parent_id",
    as: "parent",
});

// Define the reverse association here to avoid circular dependency issues in Category model
Category.hasMany(MaterialCategoryOrder, {
    foreignKey: "category_id",
    as: "materialCategoryOrders",
});

export default MaterialCategoryOrder;
