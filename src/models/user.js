const { STRING } = require('sequelize');
const Sequelize = require('sequelize');
const { db } = require('../config/database');

const User = db.define('User', {

    firstName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false
    },
    middleName: {
        type: Sequelize.DataTypes.STRING,
    },

    password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        // validate: {
        //     is: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/i,
        //     notNull: true,
        //     notEmpty: true,
        //     max: 20
        // }
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notNull: true,
            isEmail: true,
            notEmpty: true,

        }
    },
    sex: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: 'value',
        allowNull: false,
        validate: {
            is: ['[a-z]', 'i'],
            isIn: {
                msg: 'unacceptable data inputted',
                args: [['male', 'female']],
            }
        }
    },
}, {
    tableName: 'Users',
});

// User.sync({ force: true })
//     .then((data) => console.log('Table created'))
//     .catch(err => console.log('Error: '));

/* If you want to use alt  .sequalize.sync({ alter: true }) use it with
{
        type: Sequelize.DataTypes.STRING,
        defaultValue: 'value',
        allowNull: false,
        validate: {
            isIn: {
                msg: 'unacceptable data inputted',
                args: [['value', 'another value']],
            }
        }
    }
    good for development but during production you can change it to 
    User.sync({ force: true })
    then in your model to
    {
       type: Sequelize.DataTypes.ENUM('value', 'another value'),
        defaultValue: 'value',
        allowNull: false,   
    }
*/
User.sync({ alter: true })
    .then((data) => console.log('User Table created'))
    .catch(err => console.log('Error: '));



module.exports = User;
