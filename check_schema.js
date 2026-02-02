
import { sequelize } from './src/config/database.config.js';

async function checkSchema() {
    try {
        const table = await sequelize.getQueryInterface().describeTable('degrees');
        console.log(JSON.stringify(table, null, 2));
    } catch (error) {
        console.error(error);
    } finally {
        await sequelize.close();
    }
}

checkSchema();
