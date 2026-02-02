
import { sequelize } from '../config/database.config.js';
import Degree from '../models/degree/Degree.model.js';

const run = async () => {
    await sequelize.authenticate();
    const degrees = await Degree.findAll({ limit: 5 });
    console.log('Degrees found:', JSON.stringify(degrees, null, 2));
    await sequelize.close();
};
run();
