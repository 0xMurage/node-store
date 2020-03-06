import {Sequelize} from 'sequelize';
import {databaseConfig} from './app';

const config = databaseConfig();


const sequelize = new Sequelize(config.database, config.username, config.password, {
    storage: config.storage,
    dialect: config.dialect,
    logging: process.env.NODE_ENV !== 'production' ? console.log : null,
});

if (process.env.NODE_ENV !== 'production') {
    sequelize.sync({force: false}); // create the tables based on models if not found
}

export const seqConnection = sequelize;
