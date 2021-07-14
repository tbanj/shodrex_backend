const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    } catch (e) {
        throw e;
    }
};

const verifyPassword = async (plainPassword, hashedPassword) => {
    try {
        const isValid = await bcrypt.compare(plainPassword, hashedPassword);
        return isValid;
    } catch (e) {
        throw e;
    }
}

module.exports = { hashPassword, verifyPassword }
