const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send({ message: 'Please Login' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.email = decoded.email;
        next();
    } catch (err) {
        res.status(401).send({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;