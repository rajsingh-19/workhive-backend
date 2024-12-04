const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyUser = async (req, res, next) => {
    //              get the token from the cookies or req.header.authorization
    const token = req.headers.authorization;
    //              check if the token is present or not
    if(!token) {
        return res.json({status: false, message: "Authentication failed"});
    }
    try {
        //          Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //          Store the decoded information (user data) in the request object
        req.user = decoded;
        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        console.log(err);
        res.json({status: false, message: "Invalid token"});
    }
};

module.exports = verifyUser;
