const jwt = require('jsonwebtoken');

const accessTokenSecret = '395c61d4ac6790dd88e2aa4aeacbba12a89a547a39e295c653b81ee846501f26';

module.exports = {
    signAccessToken: async (userId) => {
        const payload = { aud: userId, };
        const secret = accessTokenSecret;
        const options = {
            issuer: 'todo.co',
            subject: 'userAuth',
            expiresIn: '1h',
            // audience: userId
        }

        return jwt.sign(payload, secret, options);
    },

    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization']) return next(res.status(403).send('Unauthorized Access.'));
        const token = req.headers['authorization'].split(' ')[1];   /**Bearer token:hs256 */

        jwt.verify(token, accessTokenSecret, (err, decoded) => {
            if (err) {
                return next(res.status(403).json(err));
            }
            req.payload = decoded;
            next();
        })
    }
}