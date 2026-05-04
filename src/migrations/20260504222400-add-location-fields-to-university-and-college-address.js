/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  const universityTable = await queryInterface
    .describeTable("university")
    .catch(() => ({}));
  const collegeAddressTable = await queryInterface
    .describeTable("college_addresses")
    .catch(() => ({}));

  // 1. Add location fields to university
  if (!universityTable.country) {
    await queryInterface.addColumn("university", "country", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
  if (!universityTable.state) {
    await queryInterface.addColumn("university", "state", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
  if (!universityTable.city) {
    await queryInterface.addColumn("university", "city", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
  if (!universityTable.street) {
    await queryInterface.addColumn("university", "street", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
  if (!universityTable.postal_code) {
    await queryInterface.addColumn("university", "postal_code", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }

  // 2. Add location fields to college_addresses
  if (!collegeAddressTable.country) {
    await queryInterface.addColumn("college_addresses", "country", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
  if (!collegeAddressTable.city) {
    await queryInterface.addColumn("college_addresses", "city", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
  if (!collegeAddressTable.street) {
    await queryInterface.addColumn("college_addresses", "street", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
  if (!collegeAddressTable.postal_code) {
    await queryInterface.addColumn("college_addresses", "postal_code", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
}

export async function down(queryInterface, Sequelize) {
  const universityTable = await queryInterface
    .describeTable("university")
    .catch(() => ({}));
  const collegeAddressTable = await queryInterface
    .describeTable("college_addresses")
    .catch(() => ({}));

  if (universityTable.country) {
    await queryInterface.removeColumn("university", "country");
  }
  if (universityTable.state) {
    await queryInterface.removeColumn("university", "state");
  }
  if (universityTable.city) {
    await queryInterface.removeColumn("university", "city");
  }
  if (universityTable.street) {
    await queryInterface.removeColumn("university", "street");
  }
  if (universityTable.postal_code) {
    await queryInterface.removeColumn("university", "postal_code");
  }

  if (collegeAddressTable.country) {
    await queryInterface.removeColumn("college_addresses", "country");
  }
  if (collegeAddressTable.city) {
    await queryInterface.removeColumn("college_addresses", "city");
  }
  if (collegeAddressTable.street) {
    await queryInterface.removeColumn("college_addresses", "street");
  }
  if (collegeAddressTable.postal_code) {
    await queryInterface.removeColumn("college_addresses", "postal_code");
  }
}
