"use strict";

const now = new Date();

const rows = [
  {
    type: "LEVEL",
    slug: "PLUS2",
    label: "+2 / Grade 12",
    description:
      "Free Grade 12 board exam prep for every member, plus early access to career-field trainings.",
    metadata: JSON.stringify({
      tagline: "Board exam prep + early career-field access",
      fee: "Rs. 1,000",
      note: "INCLUDES FREE EXAM PREP",
    }),
    sort_order: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    type: "LEVEL",
    slug: "BACHELORS",
    label: "Bachelor's - Running",
    description:
      "Trainings matched to your actual degree, added straight to your resume.",
    metadata: JSON.stringify({
      tagline: "Course-aligned professional trainings",
      fee: "Rs. 3,000",
      note: "RUNNING BACHELOR STUDENTS",
    }),
    sort_order: 2,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    type: "LEVEL",
    slug: "GRADUATE",
    label: "Graduate",
    description:
      "Placement-weighted upskilling with depth per field, priced to your career.",
    metadata: JSON.stringify({
      tagline: "Placement-focused upskilling",
      fee: "Custom fee",
      note: "PRICED BY FIELD",
    }),
    sort_order: 3,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    type: "CAREER_FIELD",
    slug: "it",
    label: "Information Technology",
    description: "Delivered with partner colleges",
    metadata: JSON.stringify({
      associated_levels: ["PLUS2", "BACHELORS", "GRADUATE"],
      trainings: [
        { title: "Web Development Fundamentals", description: "HTML, CSS, JS basics" },
        { title: "Python Programming", description: "Core programming for beginners" },
        { title: "Cybersecurity Essentials", description: "Foundations of safe systems & practices" },
        { title: "Digital Marketing", description: "SEO, social media & content basics" },
      ],
    }),
    sort_order: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    type: "CAREER_FIELD",
    slug: "hospitality",
    label: "Hospitality Management",
    description: "Delivered with partner hospitality colleges",
    metadata: JSON.stringify({
      associated_levels: ["PLUS2", "BACHELORS", "GRADUATE"],
      trainings: [
        { title: "Front Office & Guest Services", description: "Reception & guest handling skills" },
        { title: "Food & Beverage Operations", description: "F&B service fundamentals" },
        { title: "Hotel Management Software Basics", description: "PMS tools used in real hotels" },
        { title: "Communication & Guest Handling", description: "Soft skills for hospitality careers" },
      ],
    }),
    sort_order: 2,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    type: "CAREER_FIELD",
    slug: "business",
    label: "Business & Management",
    description: "Delivered with partner business colleges",
    metadata: JSON.stringify({
      associated_levels: ["PLUS2", "BACHELORS", "GRADUATE"],
      trainings: [
        { title: "Business Fundamentals", description: "Core concepts for any business path" },
        { title: "Digital Marketing for Business", description: "Practical marketing for small business" },
        { title: "Basic Financial Literacy", description: "Budgeting, accounting basics" },
        { title: "Communication & Presentation Skills", description: "Workplace-ready soft skills" },
      ],
    }),
    sort_order: 3,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    type: "PAYMENT_METHOD",
    slug: "esewa",
    label: "eSewa",
    description: "Mobile wallet",
    metadata: null,
    sort_order: 1,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    type: "PAYMENT_METHOD",
    slug: "khalti",
    label: "Khalti",
    description: "Mobile wallet",
    metadata: null,
    sort_order: 2,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    type: "PAYMENT_METHOD",
    slug: "bank",
    label: "Bank Transfer",
    description: "Bank slip upload",
    metadata: null,
    sort_order: 3,
    is_active: true,
    createdAt: now,
    updatedAt: now,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("membership_options", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM("LEVEL", "CAREER_FIELD", "PAYMENT_METHOD"),
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING(160),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("membership_options", ["type", "slug"], {
      unique: true,
      name: "idx_membership_options_type_slug",
    });

    await queryInterface.bulkInsert("membership_options", rows);
  },

  async down(queryInterface) {
    await queryInterface.removeIndex(
      "membership_options",
      "idx_membership_options_type_slug"
    );
    await queryInterface.dropTable("membership_options");
  },
};
