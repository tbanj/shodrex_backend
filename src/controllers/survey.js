const express = require('express');
const { db } = require('../config/database');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const Survey = require('../models/survey');
const Helper = require('../libs/helper');
const ValidateData = require('../libs/validateData');
const SurveySchema = require('../validators/survey');

const getSearchSurvey = (req, res) => {
    Survey.findAll({ where: { ownPhone: { [Op.like]: '%' + req.query.ownPhone + '%' } } })
        .then((surveys) => res.status(200).send({ data: surveys }))
        .catch(err => {
            console.log('Error', err);
            res.status(500).send({ Error: { message: err } });
        })
}

const getSurveys = (req, res) => Survey.findAll()
    .then(surveys => {
        // console.log('surveys', surveys);
        res.status(200).send({ data: surveys });
    })
    .catch((err) => {
        console.log('Error: ', err);
        res.status(500).send({ Error: { message: err } });
    });

//    Add survey
const addSurvey = async (req, res) => {
    try {
        console.warn('req.body', req.body);
        const validation = ValidateData(SurveySchema, { ...req.body, createdAt: new Date().toISOString() });
        if (validation.error) {
            res.status(400).send({ error: { message: validation.error.message } });
            return;
        };

        const [result, metadata] = await Survey.sequelize.query(`SELECT * FROM shodrex_survey.Surveys
        WHERE email = '${req.body.email}' `);

        if (result.length > 0) {
            res.status(401).send({ error: { message: 'you have already filled the survey form' } });
            return;
        };

        const survey = await Survey.create(validation.value)
        res.status(201).send({ error: { data: survey } });

    } catch (err) {
        console.error('error', err);
        res.status(500).send({ Error: { message: err } });
    }
};


const deleteTable = async (req, res) => {
    try {
        await Firm.drop();
        res.status(200).send({ data: { message: 'Survey table deleted successfully' } });
    } catch (error) {
        console.log('Unable to delete Survey Table', err);
        res.status(500).send({ error: { message: err } });
    }
};

const createTable = async (req, res) => {
    try {
        await Firm.sync();
        res.status(201).send({ data: { message: 'Survey table created' } });
    } catch (error) {
        console.log('Unable to create Survey Table', err);
        res.status(500).send({ error: { message: err } });
    }
};

module.exports = { getSurveys, addSurvey, getSearchSurvey, createTable, deleteTable };