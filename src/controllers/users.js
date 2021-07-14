const express = require('express');
const { db } = require('../config/database');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const User = require('../models/user');
const ValidateData = require('../libs/validateData');
const UserSchema = require('../validators/user');
const UserPassSchema = require('../validators/userPass');
const { hashPassword, verifyPassword } = require('../libs/securePassword');
const { generateToken } = require('../libs/generateToken');




const add = async (req, res) => {
    try {
        const validation = ValidateData(UserSchema, { ...req.body, createdAt: new Date().toISOString() });
        if (validation.error) {
            res.status(400).send({ error: { message: validation.error.message } });
            return;
        }

        const [result, metadata] = await User.sequelize.query(`SELECT * FROM shodrex_survey.Users
        WHERE email = '${req.body.email}' `);
        if (result.length > 0) {
            res.status(401).send({ error: { message: 'you have already filled the survey form' } });
            return;
        };

        const password = await hashPassword(validation.value.password);
        const user = await User.create({ ...validation.value, password });
        res.status(201).send({ data: user });

    } catch (err) {
        console.error('error', err);
        res.status(500).send({ error: { message: err } });
    }
};

const login = async (req, res) => {
    try {
        const { password, email } = req.body;
        const [result, metadata] = await User.sequelize.query(`SELECT * FROM shodrex_survey.Users WHERE email= '${email}'`);

        if (!result) {
            return res.status(400).send({ error: { message: 'Invalid email or password. Please try again.' } });
            return;
        }
        if (result.length < 1) {
            return res.status(400).send({ error: { message: 'Invalid email or password. Please try again.' } });
            return;
        }

        const validPassword = await verifyPassword(password, result[0]["password"]);
        if (!validPassword) {
            return res.status(400).send({ error: { message: 'Invalid email or password. Please try again.' } });
        }
        console.warn('firstName', result[0].firstName);
        const token = await generateToken({ firstName: result[0].firstName, lastName: result[0].lastName, email: result[0].email }, '12h');
        console.warn('token', token);
        res.status(200).send({ data: { token } });
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send({ error: { message: err } });
    }
}

const extendToken = async (req, res) => {
    try {
        console.warn('welcome here', req.firstName, req.lastName, req.email);
        const token = await generateToken({ firstName: req.firstName, lastName: req.lastName, email: req.email }, '12h');

        res
            .header("Authorization", token).header("access-control-expose-headers", "Authorization")
            .status(200).send({ data: { token } });

    } catch (e) {
        res.status(404).send({ error: { message: e.message } });
    }

}
const logout = async (req, res) => {
    try {
        const { token, email } = req.body;
        const [result, metadata] = await User.sequelize.query(`SELECT * FROM shodrex_survey.Users
        WHERE email = '${email}' `);

        if (result.length < 1) {
            res.status(401).send({ error: { message: 'Unable to logout user. Please try again.' } });
            return;
        }


        res.send({ success: { message: 'Logout successful' } });
    } catch (e) {
        console.error('Error: ', err);
        res.status(500).send({ error: { message: err } });
    }
}

const getUsers = (req, res) => {
    User.findAll()
        .then(users => res.status(200).send({ data: users }))
        .catch(err => {
            console.log('Error: ', err);
            res.status(500).send({ error: { message: err } });
        });
}

const deleteTable = async (req, res) => {
    try {
        await User.drop();
        res.status(200).send({ data: { message: 'User table deleted successfully' } });
    } catch (error) {
        console.log('Unable to delete Table', err);
        res.status(500).send({ error: { message: error } });
    }
}

const createTable = async (req, res) => {
    try {
        await User.sync();
        res.status(201).send({ data: { message: 'User table created' } });
    } catch (error) {
        console.log('Unable to create Table', err)
        res.status(500).send({ error: { message: error } });
    }
}

const getUserQueryData = async (req, res) => {
    try {
        const [result, metadata] = await User.sequelize.query(`SELECT * FROM shodrex_survey.Users
        ORDER BY firstName ASC`);
        if (!result) {
            res.status(400).send({ error: { message: 'unable to query table' } });
            return;
        }
        res.status(200).send({ data: { result } });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).send({ error: { message: error } });
    }
};

const getUser = async (req, res) => {
    try {
        const [result, metadata] = await User.sequelize.query(`SELECT * FROM shodrex_survey.Users
        WHERE id = '${req.params.id}' ORDER BY firstName ASC`);
        if (!result) {
            res.status(400).send({ error: { message: 'unable to query table' } });
            return;
        }
        res.status(200).send({ data: result });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).send({ error: { message: error } });
    }
};

const deleteRecord = async (req, res) => {
    try {
        const [result, metadata] = await User.sequelize.query(`DELETE FROM shodrex_survey.Users
        WHERE id = '${req.params.id}' `);
        if (!result) {
            res.status(400).send({ error: { message: 'unable to query table' } });
            return;
        }
        res.status(200).send({ data: `${metadata.rowCount} record(s) deleted` });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).send({ error: { message: error } });
    }
};


const updateRecord = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const userUpdate = req.body;
        // there where clause can have more than attributes e.g id, name,data
        const user = await User.findOne({ where: { id: req.params.id } });

        if (!user) {
            res.status(400).send({ error: { message: 'no match data found' } });
            return;
        }
        updates.map(property => user['dataValues'][property] = userUpdate[property]);
        user.save();
        res.status(200).send({ data: user });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).send({ error: { message: error } });
    }
};

const getSearchUser = (req, res) => {
    const firstName = req.params.firstName.toLowerCase();
    User.findAll({ where: { firstName: { [Op.like]: '%' + firstName + '%' } } })
        .then((users) => res.status(200).send({ data: users }))
        .catch(err => {
            console.log('Error', err);
            res.status(500).send({ Error: { message: err } });
        })
};

const getSameRecDates = async (req, res) => {
    try {
        // there where clause can have more than attributes e.g id, name,data
        const { startDate, endDate } = req.body;
        // const user = await User.findAll({ where: { createdAt: req.params.date } });
        const [result, metadata] = await User.sequelize.query(`SELECT * FROM shodrex_survey.Users
WHERE createdAt BETWEEN '${startDate}' AND '${endDate}' `);
        if (!result) {
            res.status(400).send({ error: { message: 'unable to query table based on dates' } });
            return;
        }

        res.status(200).send({ data: result });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).send({ error: { message: error } });
    }
};



module.exports = {
    add, getUsers, getSearchUser, deleteTable, createTable,
    getUserQueryData, getUser, deleteRecord, updateRecord, getSameRecDates,
    login, extendToken
};


