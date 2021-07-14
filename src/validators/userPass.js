const Joi = require('@hapi/joi');

const UserPassSchema = Joi.object({
    middleName: Joi.string().min(3).trim().optional(),
    email: Joi.string().email({ minDomainSegments: 2 }).optional().allow(''),
    password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/i)).optional(),
    createdAt: Joi.date().iso().required(),
    updatedAt: Joi.date().iso().optional()
});

module.exports = UserPassSchema;