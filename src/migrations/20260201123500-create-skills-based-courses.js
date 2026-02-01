export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("skills_based_courses", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            slug: {
                type: Sequelize.STRING,
                allowNull: true,
                unique: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            thumbnail_image: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM("active", "inactive"),
                allowNull: false,
                defaultValue: "active",
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: true,
            },
            duration: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            is_featured: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            likes_count: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("skills_based_courses");
    },
};
