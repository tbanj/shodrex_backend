/*
Setting up connection for sequelize implementation for postgress
Option 2: Passing a connection URI
*/
const { Sequelize } = require('sequelize');
const dotenv = require("dotenv").config();
const env = require('../env');

// for xamp http://192.168.64.2/
const db = new Sequelize(env.db_name, env.db_username, env.db_password, {
    host: '127.0.0.1',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialect: 'mysql',
    // operatorsAliases: false
});


// for remote sequelize connection
// const db = new Sequelize(process.env.CLEARDB_DATABASE_URL, {
//     dialect: 'mysql',
// });

// const db = new Sequelize('mysql://localhost:8080/test', {})
// const createAndUseDB = async (table, databaseName) => {
//     let dbe = null;
//     try {
//         const dbUpdated = await = sequelize.sync({force: true, match: /_`${databaseName}`$/});
//         if (!dbUpdated) {

//         }
//     } catch (error) {
//         console.log('Error', error);
//         throw new Error(`Cannot create nor use table name ${databaseName}`);
//     }

// }
// db.authenticate()
//     .then(() => console.log(' Database connected...'))
//     .catch((err) => console.log('Error: ', err));


module.exports = { db };