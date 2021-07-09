const express = require('express');
const { db } = require('../config/database');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Survey = require('../models/survey');

const getSearchSurvey = (req, res) => {
    console.log('term', req.query);
    let { term } = req.query;
    // term = term.toUpperCase();
    Survey.findAll({ where: { technologies: { [Op.like]: '%' + term + '%' } } })
        .then((surveys) => res.status(200).json({ data: surveys }))
        .catch(err => {
            console.log('Error', err);
            res.status(500).json({ Error: { message: err } });
        })
}

const getSurveys = (req, res) => Survey.findAll()
    .then(surveys => {
        // console.log('surveys', surveys);
        res.status(200).json({ data: surveys });
    })
    .catch((err) => {
        console.log('Error: ', err);
        res.status(500).json({ Error: { message: err } });
    });

//    Add survey
const addSurvey = async (req, res) => {
    console.log('detail inputted', req.body);
    // const data = {
    //     ownPhone: 'Simple',/
    //     email: 'user2@gmail.com',
    // }

    let { title, technologies, budget, description, contactEmail } = req.body;
    let errors = [];
    if (!title) {
        errors.push({ text: 'Please add a title' })
    }
    if (!description) {
        errors.push({ text: 'Please add a description' })
    }
    if (!technologies) {
        errors.push({ text: 'Please add a technology' })
    }
    if (!contactEmail) {
        errors.push({ text: 'Please add a contact email' })
    }

    if (errors.length > 0) {
        res.status(400).json({ error: errors })
    } else {
        if (!budget) {
            budget = 'Unknown';
        } else { budget = `$${budget}`; }

        // Make lowercase and remove space after comma
        technologies = technologies.toLowerCase().replace(/, /g, ',');

        // Insert into table
        await Survey.create({ title, technologies, budget, description, contactEmail })
            .then((survey) => res.status(201).json({ data: survey }))
            .catch(err => {
                console.log('Error: ', err)
                res.status(500).json({ Error: { message: err } })
            });
    }
};


const deleteTable = async (req, res) => {
    try {
        await Firm.drop();
        res.status(200).json({ data: { message: 'Firm table deleted successfully' } });
    } catch (error) {
        console.log('Unable to delete Firm Table', err);
        res.status(500).json({ error: { message: err } });
    }
};

const createTable = async (req, res) => {
    try {
        await Firm.sync();
        res.status(201).json({ data: { message: 'Survey table created' } });
    } catch (error) {
        console.log('Unable to create Survey Table', err);
        res.status(500).json({ error: { message: err } });
    }
};

module.exports = { getSurveys, addSurvey, getSearchSurvey, createTable, deleteTable };