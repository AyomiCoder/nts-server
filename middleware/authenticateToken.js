const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'] || req.headers['Authorization']; // Handle case-insensitive headers
    const token = authHeader && authHeader.split(' ')[1];  // Get the token part after 'Bearer '

    if (!token) {
        return res.status(401).json({ error: true, message: "Access token required" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: true, message: "Invalid access token" });
        }

        // console.log("User decoded from token:", user); // Add a debug log to ensure the user is decoded
        req.user = user;  // Attach the user object to the request
        next();  // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;
