const Joi = require('@hapi/joi');

const UserSchema = Joi.object({
    firstName: Joi.string().min(3).trim().required(),
    lastName: Joi.string().min(3).trim().required(),
    middleName: Joi.string().min(3).trim().optional(),
    email: Joi.string().email({ minDomainSegments: 2 }).optional().allow(''),
    password: Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/i)).optional(),
    sex: Joi.string().valid("male", "female", "transgender", "gender neutral", "non-binary", "agender", "pangender", "genderqueer", "two-spirit", "third gender").trim().required(),
    createdAt: Joi.date().iso().required(),
    updatedAt: Joi.date().iso().optional()
});

module.exports = UserSchema;