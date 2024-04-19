const jwt = require('jsonwebtoken')
require('dotenv').config()
const debug = require('debug')('book-test:checkJwt')
const User = require('../../models/userModel')

//migrate server action
exports.checkJwt = async (req, res, next) => {
    
    try {
        let token = req.cookies['jwt']
        debug('JWT TOKEN', token)
        let decoded = jwt.verify(token, process.env.JWT_SECRET)

        const newToken = jwt.sign({
            _id: decoded._id,
            name: decoded.name
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        res.cookie('jwt', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        })

        debug('JWT REFRESHED')

        req.user = decoded
        next()

    } catch (err) {
        res.status(401).json({
            message: 'Jwt not authorized',
        })
    }
}

exports.checkJwtAdmin = async (req, res, next) => {
    try {
        let token = req.cookies['jwt']
        debug('JWT TOKEN', token)
        let decoded = jwt.verify(token, process.env.JWT_SECRET)

        const theUser = await User.findById(decoded._id)
        if (theUser) {
            if (theUser.role === 'Admin'){
                const newToken = jwt.sign({
                    _id: decoded._id,
                    name: decoded.name
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                })
                res.cookie('jwt', newToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'
                })
                debug('JWT REFRESHED')

                req.user = decoded
                next()
            } else {
                res.status(401).json({
                    message: 'User is not authorized to post.'
                })
            }
        } else {
            res.status(401).json({
                message: 'Jwt not authorized',
            })
        }
       

        

        

    } catch (err) {
        res.status(401).json({
            message: 'Jwt not authorized',
        })
    }
}