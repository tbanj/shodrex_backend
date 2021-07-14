
const { verifyToken } = require('../libs/generateToken');

const auth = async (req, res, next) => {
    const { headers, method, url, httpVersion } = req;
    try {
        let token = req.headers.authorization.replace('Bearer ', '');
        console.warn('token', token);
        const decoded = await verifyToken(token);
        console.warn('decoded ', decoded);
        if (!decoded) {
            throw new Error();
        }
        req.email = decoded.email;
        req.firstName = decoded.firstName;
        req.lastName = decoded.lastName;
        next();
        return;
    } catch (e) {
        res.status(401).send({ error: { message: "Not authenticated. Please authenticate." } });
    }
}

module.exports = auth;