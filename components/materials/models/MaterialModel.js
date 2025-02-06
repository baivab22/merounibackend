import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../config/database.js';

class Material extends Model {}

Material.init(
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
    tags: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    author: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'mu_users',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      allowNull: false,
      defaultValue: 'draft',
    },
    visibility: {
      type: DataTypes.ENUM('public', 'private'),
      allowNull: false,
      defaultValue: 'public',
    }
  },
  {
    sequelize,
    modelName: 'materials',
    freezeTableName: true,
    timestamps: true,
  }
);

export default Material;