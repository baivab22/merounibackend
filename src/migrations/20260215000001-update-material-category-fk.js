'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  // 1. Drop the existing foreign key constraint
  // We need to know the constraint name. The error message says 'materials_category_id_foreign_idx'
  // but usually sequelize creates 'materials_category_id_foreign_idx' as an index and 'materials_ibfk_...' as constraint or similar.
  // However, the error says `CONSTRAINT materials_category_id_foreign_idx`. 
  // Let's try to remove it. If it fails, we might need to check 'materials_ibfk_1' or similar.
  // Often better to try removing likely names.
  
  try {
    await queryInterface.removeConstraint('materials', 'materials_category_id_foreign_idx');
  } catch (e) {
    console.warn('Could not remove constraint materials_category_id_foreign_idx', e.message);
    // fallback or ignore if not exists
  }

  // 2. Set category_id to NULL for any values that don't exist in the new categories table
  // This prevents the foreign key constraint from failing
  await queryInterface.sequelize.query(`
    UPDATE materials 
    SET category_id = NULL 
    WHERE category_id IS NOT NULL 
    AND category_id NOT IN (SELECT id FROM categories)
  `);

  // 3. Add the new constraint referencing the categories table
  await queryInterface.addConstraint('materials', {
    fields: ['category_id'],
    type: 'foreign key',
    name: 'materials_category_id_fk_new', // Give it a clear name
    references: {
      table: 'categories',
      field: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
}

export async function down(queryInterface) {
  try {
    await queryInterface.removeConstraint('materials', 'materials_category_id_fk_new');
  } catch (e) {
    console.warn('Could not remove new constraint', e.message);
  }

  // Restore old constraint (pointing to material_categories)
  await queryInterface.addConstraint('materials', {
    fields: ['category_id'],
    type: 'foreign key',
    name: 'materials_category_id_foreign_idx',
    references: {
      table: 'material_categories',
      field: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  });
}
