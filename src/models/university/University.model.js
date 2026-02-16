import { DataTypes } from "sequelize";
import { sequelize } from "../../config/database.config.js";

import Level from "../level/Level.model.js";
import Program from "../program/Program.model.js";

export const University = sequelize.define(
  "University",
  {
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
      type: DataTypes.ENUM("Public", "Private"),
    },
    // This is for the order of the university in the website
    order_no_for_website: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      field: "order_no_for_website",
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "mu_users",
        key: "id",
      },
    },
    description: {
      type: DataTypes.TEXT,
    },

    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    featured_image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    videos: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "university",
    timestamps: true,
  }
);

export const UniversityContact = sequelize.define(
  "UniversityContact",
  {
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
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "university_contact",
    timestamps: false,
  }
);

export const UniversityLevel = sequelize.define(
  "UniversityLevel",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    university_id: {
      type: DataTypes.INTEGER,
      references: {
        model: University,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    level_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Level,
        key: "id",
      },
    },
  },
  {
    tableName: "university_levels",
    timestamps: false,
  }
);

export const UniversityProgram = sequelize.define(
  "UniversityProgram",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    university_id: {
      type: DataTypes.INTEGER,
      references: {
        model: University,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    program_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Program,
        key: "id",
      },
    },
  },
  {
    tableName: "university_programs",
    timestamps: false,
  }
);

export const UniversityMember = sequelize.define(
  "UniversityMember",
  {
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
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "university_members",
    timestamps: false,
  }
);


export const UniversityGallery = sequelize.define(
  "UniversityGallery",
  {
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
        key: "id",
      },
      onDelete: "CASCADE",
    },
  },
  {
    tableName: "university_gallery",
    timestamps: false,
  }
);

// Define Associations (Important!)
University.hasOne(UniversityContact, {
  as: "contact",
  foreignKey: "university_id",
}); // 'contact' is the alias
UniversityContact.belongsTo(University, {
  as: "university",
  foreignKey: "university_id",
});

University.hasMany(UniversityLevel, {
  as: "levels",
  foreignKey: "university_id",
});
UniversityLevel.belongsTo(University, {
  as: "university",
  foreignKey: "university_id",
});
University.hasMany(UniversityProgram, {
  as: "university_programs",
  foreignKey: "university_id",
});
UniversityProgram.belongsTo(University, {
  as: "university",
  foreignKey: "university_id",
});
UniversityProgram.belongsTo(Program, {
  as: "program",
  foreignKey: "program_id",
});
Program.hasMany(UniversityProgram, {
  as: "university_programs",
  foreignKey: "program_id",
});
University.hasMany(UniversityMember, {
  as: "members",
  foreignKey: "university_id",
});
UniversityMember.belongsTo(University, {
  as: "university",
  foreignKey: "university_id",
});


University.hasMany(UniversityGallery, {
  as: "gallery",
  foreignKey: "university_id",
});
UniversityGallery.belongsTo(University, {
  as: "university",
  foreignKey: "university_id",
});
