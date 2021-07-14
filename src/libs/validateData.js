
/**
 * Validate clients' data against the joi schema before saving to the database
 * @param {object} schema - Joi schema
 * @param {object} data - clients data to validate
 * @returns {object} validation - The validated data
 */
const validateData = (schema, data) => {
    const validation = schema.validate(data);
    return validation;
};

module.exports = validateData;