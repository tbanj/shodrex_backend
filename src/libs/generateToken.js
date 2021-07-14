const jwt = require('jsonwebtoken');

require('dotenv').config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const generateToken = async (payload, expireTime) => {
    try {
        let token;
        if (expireTime === undefined) {
            token = await jwt.sign(payload, jwtSecretKey, { expiresIn: '8h' });
        } else { token = await jwt.sign(payload, jwtSecretKey, { expiresIn: expireTime }); }
        return token;
    } catch (e) { throw e; }
};

const verifyToken = async (token) => {
    try {
        const payload = jwt.verify(token, jwtSecretKey);
        return payload;
    } catch (e) { throw e; }
};

module.exports = {
    generateToken,
    verifyToken
}