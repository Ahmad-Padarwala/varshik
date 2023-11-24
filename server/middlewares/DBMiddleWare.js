const conn = require("../db/conn");

// Database connection middleware
const DBMiddleware = (req, res, next) => {
    conn.getConnection((err, connection) => {
        if (err) {
            res.status(500).json(err);
        } else {
            req.dbConnection = connection; // Attach the connection to the request object
            next(); // Continue to the route handler
        }
    });
};

module.exports = DBMiddleware;
