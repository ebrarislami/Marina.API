const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        if (decoded.role !== 'ADMIN') {
            return res.status(401).json();
        } else {
            next();
        }  
    } catch(error) {
        return res.status(401).json();
    }
};