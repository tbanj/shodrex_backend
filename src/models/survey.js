const Sequelize = require("sequelize");
const { db } = require("../config/database");


const Survey = db.define('Survey', {
    id: {
        type: Sequelize.DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    ownPhone: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Please answer with yes or no'
            }
        }
    },
    ownSim: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Please click an option'
            }
        }
    },
    phoneActivities: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Please select options which you use your phone for'
            }
        }
    },
    wishPhone: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Please enter your wish phone OS'
            }
        }
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
    }
});

Survey.sync({ alter: true })
    .then((data) => console.log('Survey Table created'))
    .catch(err => console.log('Error: '));

/* 
checkbox-group: ["Purchase products or services"]
number-own: "no"
phone-own: "yes"
phone-wish: "a"
*/

module.exports = Survey;