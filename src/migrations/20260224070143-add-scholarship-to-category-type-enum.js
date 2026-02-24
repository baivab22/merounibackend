'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface) {
  await queryInterface.sequelize.query(`
    ALTER TABLE categories 
    MODIFY COLUMN type ENUM('BLOG', 'EVENT', 'NEWS', 'MATERIAL', 'SCHOLARSHIP') 
    DEFAULT NULL
  `);
}

export async function down(queryInterface) {
  await queryInterface.sequelize.query(`
    ALTER TABLE categories 
    MODIFY COLUMN type ENUM('BLOG', 'EVENT', 'NEWS', 'MATERIAL') 
    DEFAULT NULL
  `);
}
