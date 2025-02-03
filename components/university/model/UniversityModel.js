import { DataTypes } from 'sequelize';
import { sequelize } from '../../../config/database.js'

import Level from "../../level/model/LevelModel.js"

export const University = sequelize.define('University', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slugs: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Enforce unique slugs
  },
  country: {
    type: DataTypes.STRING,
  },
  state: {
    type: DataTypes.STRING,
  },
  city: {
    type: DataTypes.STRING,
  },
  street: {
    type: DataTypes.STRING,
  },
  postal_code: {
    type: DataTypes.STRING,
  },
  date_of_establish: {
    type: DataTypes.DATE,
  },
  type_of_institute: {
    type: DataTypes.ENUM('Public', 'Private'),
  },
  description: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'university', 
  timestamps: false,      
});

export const UniversityContact = sequelize.define('UniversityContact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  faxes: {
    type: DataTypes.STRING,
  },
  poboxes: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  phone_number: {
    type: DataTypes.STRING,
  },
  university_id: { 
    type: DataTypes.INTEGER,
    references: {
      model: University,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'university_contact',
  timestamps: false,
});

export const UniversityLevel = sequelize.define('UniversityLevel', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  university_id: {
    type: DataTypes.INTEGER,
    references: {
      model: University,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  level_id: { // Assuming you have a 'levels' table
    type: DataTypes.INTEGER,
    references: {
      model: Level, // Your Levels model
      key: 'id',
    },
  },
}, {
  tableName: 'university_levels',
  timestamps: false,
});

export const UniversityMember = sequelize.define('UniversityMember', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  role: {
    type: DataTypes.STRING,
  },
  salutation: {
    type: DataTypes.STRING,
  },
  name: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  university_id: {
    type: DataTypes.INTEGER,
    references: {
      model: University,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'university_members',
  timestamps: false,
});

export const UniversityAsset = sequelize.define('UniversityAsset', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  featured_image: {
    type: DataTypes.STRING,
  },
  videos: {
    type: DataTypes.STRING,
  },
  university_id: {
    type: DataTypes.INTEGER,
    references: {
      model: University,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'university_assets',
  timestamps: false,
});

export const UniversityGallery = sequelize.define('UniversityGallery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  image_url: {
    type: DataTypes.STRING,
  },
  university_id: {
    type: DataTypes.INTEGER,
    references: {
      model: University,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'university_gallery',
  timestamps: false,
});


// Define Associations (Important!)
University.hasOne(UniversityContact, { as: 'contact', foreignKey: 'university_id' }); // 'contact' is the alias
UniversityContact.belongsTo(University, { as: 'university', foreignKey: 'university_id' });

University.hasMany(UniversityLevel, { as: 'levels', foreignKey: 'university_id' });
UniversityLevel.belongsTo(University, { as: 'university', foreignKey: 'university_id' });

University.hasMany(UniversityMember, { as: 'members', foreignKey: 'university_id' });
UniversityMember.belongsTo(University, { as: 'university', foreignKey: 'university_id' });

University.hasOne(UniversityAsset, { as: 'asset', foreignKey: 'university_id' });
UniversityAsset.belongsTo(University, { as: 'university', foreignKey: 'university_id' });

University.hasMany(UniversityGallery, { as: 'gallery', foreignKey: 'university_id' });
UniversityGallery.belongsTo(University, { as: 'university', foreignKey: 'university_id' });