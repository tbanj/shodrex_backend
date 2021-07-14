const Joi = require('@hapi/joi');

const SurveySchema = Joi.object({
    // recordDate, ownPhone,ownSim, phoneActivities wishPhone, email
    ownPhone: Joi.string().valid("yes", "no").trim().required(),
    ownSim: Joi.string().valid("yes", "no").trim().required(),
    wishPhone: Joi.string().valid("android", "apple", "windows").trim().required(),
    phoneActivities: Joi.string().min(3).trim().optional(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/i)).optional(),
    createdAt: Joi.date().iso().required(),
    updatedAt: Joi.date().iso().optional()
});

module.exports = SurveySchema;