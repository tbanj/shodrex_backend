const Sequelize = require("sequelize");
const { db } = require("../config/database");

// ecordDate, ownPhone,ownSim, phoneActivitiesn wishPhone, email
const Survey = db.define('Survey', {
    ownPhone: {
        type: Sequelize.STRING
    },
    ownSim: {
        type: Sequelize.STRING
    },
    phoneActivities: {
        type: Sequelize.STRING
    },
    wishPhone: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
    }
});

Survey.sync({ alter: true })
    .then((data) => console.log('Survey Table created'))
    .catch(err => console.log('Error: '));



module.exports = Survey;