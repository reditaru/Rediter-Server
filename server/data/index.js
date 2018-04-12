import Sequelize from 'sequelize'
import fs from 'fs'
import path from 'path'
import config from '../config'

const dataConfig = config.database
const sequelize = new Sequelize(dataConfig.name, dataConfig.username, dataConfig.password, {
    dialect: dataConfig.dialect,
    host: dataConfig.host,
    port: dataConfig.port,
    pool: dataConfig.pool,
    define: {
        charset: dataConfig.charset,
        collate: 'utf8_general_ci'
    }
})
const db = {}
fs
    .readdirSync(path.join(__dirname, 'models'))
    .forEach(function(file) {
        const model = sequelize.import(path.join(__dirname, 'models', file));
        db[model.name] = model;
    });
Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});
if (config.env === 'dev') {
    sequelize.sync({
        force: true
    });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
