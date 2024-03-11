const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.checkJwt = async (req, res, next) => {
    
    try {
        let token = req.cookies['jwt']
        let decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded
        next()

    } catch (err) {
        res.status(401).json({
            message: 'Not authorized'
        })
    }
}