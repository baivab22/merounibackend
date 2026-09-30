import { DataTypes } from "sequelize";

// Members quote this reference in their offline payment (eSewa / Khalti / bank
// transfer) so the admin can look the application up in the dashboard and verify
// it. Legacy rows get a MU-LEGACY-<id> placeholder so the column can be NOT NULL.
export async function up(queryInterface) {
  await queryInterface.addColumn("student_memberships", "reference_id", {
    type: DataTypes.STRING(24),
    allowNull: true,
  });

  await queryInterface.sequelize.query(
    `UPDATE student_memberships SET reference_id = CONCAT('MU-LEGACY-', id) WHERE reference_id IS NULL`
  );

  await queryInterface.changeColumn("student_memberships", "reference_id", {
    type: DataTypes.STRING(24),
    allowNull: false,
  });

  await queryInterface.addIndex("student_memberships", ["reference_id"], {
    name: "idx_student_memberships_reference_id",
    unique: true,
  });
}

export async function down(queryInterface) {
  await queryInterface.removeIndex(
    "student_memberships",
    "idx_student_memberships_reference_id"
  );
  await queryInterface.removeColumn("student_memberships", "reference_id");
}
