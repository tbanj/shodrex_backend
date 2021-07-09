const express = require('express');
const { db } = require('../config/database');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const User = require('../models/user');




const add = (req, res) => {
    let { firstName, lastName, middleName, password, email, sex } = req.body;
    firstName = firstName.toLowerCase().trim();
    lastName = lastName.toLowerCase().trim();
    middleName = middleName.toLowerCase().trim();
    sex = sex.toLowerCase().trim();
    User.create({ firstName, lastName, middleName, password, email, sex })
        .then(user => res.status(201).json({ data: user }))
        .catch(err => {
            console.log('Error: ', err);
            res.status(500).json({ error: { message: err } });
        });
};

const getUsers = (req, res) => {
    User.findAll()
        .then(users => res.status(200).json({ data: users }))
        .catch(err => {
            console.log('Error: ', err);
            res.status(500).json({ error: { message: err } });
        });
}

const deleteTable = async (req, res) => {
    try {
        await User.drop();
        res.status(200).json({ data: { message: 'User table deleted successfully' } });
    } catch (error) {
        console.log('Unable to delete Table', err);
        res.status(500).json({ error: { message: error } });
    }
}

const createTable = async (req, res) => {
    try {
        await User.sync();
        res.status(201).json({ data: { message: 'User table created' } });
    } catch (error) {
        console.log('Unable to create Table', err)
        res.status(500).json({ error: { message: error } });
    }
}

const getUserQueryData = async (req, res) => {
    try {
        const [result, metadata] = await User.sequelize.query(`SELECT * FROM public."Users"
        ORDER BY "firstName" ASC`);
        if (!result) {
            res.status(400).json({ error: { message: 'unable to query table' } });
            return;
        }
        res.status(200).json({ data: { result } });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ error: { message: error } });
    }
};

const getUser = async (req, res) => {
    try {
        const [result, metadata] = await User.sequelize.query(`SELECT * FROM public."Users"
        WHERE "id" = '${req.params.id}' ORDER BY "firstName" ASC`);
        if (!result) {
            res.status(400).json({ error: { message: 'unable to query table' } });
            return;
        }
        res.status(200).json({ data: result });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ error: { message: error } });
    }
};

const deleteRecord = async (req, res) => {
    try {
        const [result, metadata] = await User.sequelize.query(`DELETE FROM public."Users"
        WHERE "id" = '${req.params.id}' `);
        if (!result) {
            res.status(400).json({ error: { message: 'unable to query table' } });
            return;
        }
        res.status(200).json({ data: `${metadata.rowCount} record(s) deleted` });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ error: { message: error } });
    }
};


const updateRecord = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const userUpdate = req.body;
        // there where clause can have more than attributes e.g id, name,data
        const user = await User.findOne({ where: { id: req.params.id } });

        if (!user) res.status(400).json({ error: { message: 'no match data found' } });
        updates.map(property => user['dataValues'][property] = userUpdate[property]);
        user.save();
        res.status(200).json({ data: user });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ error: { message: error } });
    }
};

const getSearchUser = (req, res) => {
    console.log('term', req.params);
    let { term } = req.params;
    term = term.toLowerCase();
    User.findAll({ where: { firstName: { [Op.like]: '%' + term + '%' } } })
        .then((users) => res.status(200).json({ data: users }))
        .catch(err => {
            console.log('Error', err);
            res.status(500).json({ Error: { message: err } });
        })
};

const getSameRecDates = async (req, res) => {
    try {
        // there where clause can have more than attributes e.g id, name,data
        const { startDate, endDate } = req.body;
        // const user = await User.findAll({ where: { createdAt: req.params.date } });
        const [result, metadata] = await User.sequelize.query(`SELECT * FROM public."Users"
WHERE "createdAt" BETWEEN '${startDate}' AND '${endDate}' `);
        if (!result) {
            res.status(400).json({ error: { message: 'unable to query table based on dates' } });
            return;
        }

        res.status(200).json({ data: result });
    } catch (error) {
        console.log('Error: ', error);
        res.status(500).json({ error: { message: error } });
    }
};



module.exports = {
    add, getUsers, getSearchUser, deleteTable, createTable,
    getUserQueryData, getUser, deleteRecord, updateRecord, getSameRecDates
};