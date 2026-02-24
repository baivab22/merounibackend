'use strict';

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
    // 1. Create the college_universities junction table
    await queryInterface.createTable('college_universities', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        college_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'colleges',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        university_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'university',
                key: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    });

    // 2. Add composite unique index to prevent duplicate associations
    await queryInterface.addIndex('college_universities', ['college_id', 'university_id'], {
        unique: true,
        name: 'college_universities_unique'
    });

    // 3. Migrate existing data from colleges.university_id to college_universities
    const [colleges] = await queryInterface.sequelize.query(
        'SELECT id, university_id FROM colleges WHERE university_id IS NOT NULL'
    );

    if (colleges && colleges.length > 0) {
        const universityRecords = colleges.map((college) => ({
            college_id: college.id,
            university_id: college.university_id,
            createdAt: new Date(),
            updatedAt: new Date()
        }));
        await queryInterface.bulkInsert('college_universities', universityRecords);
    }

    // 4. Remove the university_id column from the colleges table
    await queryInterface.removeColumn('colleges', 'university_id');
}

export async function down(queryInterface, Sequelize) {
    // 1. Add back the university_id column to colleges
    await queryInterface.addColumn('colleges', 'university_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: 'university',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    // 2. Migrate back the first university found for each college
    const [records] = await queryInterface.sequelize.query(
        'SELECT college_id, university_id FROM college_universities'
    );

    if (records && records.length > 0) {
        const collegeMap = new Map();
        records.forEach(record => {
            if (!collegeMap.has(record.college_id)) {
                collegeMap.set(record.college_id, record.university_id);
            }
        });

        for (const [collegeId, universityId] of collegeMap.entries()) {
            await queryInterface.sequelize.query(
                `UPDATE colleges SET university_id = ${universityId} WHERE id = ${collegeId}`
            );
        }
    }

    // 3. Drop the college_universities table
    await queryInterface.dropTable('college_universities');
}
