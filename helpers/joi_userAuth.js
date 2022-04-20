const Joi = require('joi');

const userAuthSchema = Joi.object({
    email: Joi.string().lowercase().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'dev'] } }),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
})

module.exports = {
    userAuthSchema
}