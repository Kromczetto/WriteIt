const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const { token } = req.cookies;

    if(!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
        if(err) return res.status(401).json({ message: "Invalid token" });

        req.user = user;
        next();
    });
    
}