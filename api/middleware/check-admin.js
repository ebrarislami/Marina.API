const jwt = require('jsonwebtoken');
const models = require('../models');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, 'secret');
        req.userData = decoded;
        console.log(decoded);
        if (decoded.role !== 'Admin') {
            return res.status(403).json();
        } else {
            next();
        }  
    } catch(error) {
        return res.status(403).json();
    }
};