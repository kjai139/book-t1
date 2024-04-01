const jwt = require('jsonwebtoken')
require('dotenv').config()
const debug = require('debug')('book-test:checkJwt')

exports.checkJwt = async (req, res, next) => {
    
    try {
        let token = req.cookies['jwt']
        debug('JWT TOKEN', token)
        let decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded
        next()

    } catch (err) {
        res.status(401).json({
            message: 'Jwt not authorized',
        })
    }
}