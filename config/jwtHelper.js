const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = (req, res, next) => {
    var token;

    // Looking for token in authorisation header.
    if ('authorization' in req.headers)
        token = req.headers['authorization'].split(' ')[1];

    if (!token)
        // If there's no token along with the request.
        return res.status(403).send({ auth: false, message: 'No token provided.' });

    else {
        
        // Token verification
        jwt.verify(token, process.env.JWT_SECRET,
            (err, decoded) => {
                if (err)
                    return res.status(500).send({ auth: false, message: 'Token  failed.' });
                else {
                    req._id = decoded._id;
                    next();
                }
            }
        )
    }
}