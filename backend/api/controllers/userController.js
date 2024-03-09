const User = require('../../models/userModel')
const debug = require('debug')('book-test:userController')
const { validationResult, body } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

exports.user_createUser_post = [
    body('email').isEmail().withMessage('Invalid email format.'),
    body('username').trim().isLength({min: 2, max:20}).escape(),
    body('password').trim().isLength({min:1, max: 20})
    .matches(/^(?=.*[a-z])/).withMessage('Password must contain at least one lowercase letter')
    .matches(/^(?=.*[A-Z])/).withMessage('must contain at least one uppercase letter')
    .matches(/^(?=.*[!@#$%^&()_+-])/).withMessage('must have at least one special character').escape(),
    body('confirmPassword').trim().escape(),

    
    
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({
                message: errors
            })
        } else {
            const { username, email, password, confirmPassword } = req.body
            try {
                //check if passwords match
                if (password !== confirmPassword) {
                    res.status(409).json({
                        message: 'Passwords do not match.'
                    })
                }
                //check if email already used
                const normalizeEmail = email.toLowerCase()
                const isEmailUsed = await User.findOne({email:normalizeEmail})
                if (isEmailUsed) {
                    res.status(409).json({
                        message: 'Email address already in use.'
                    })
                } else {
                    //check if username is already in use
                    const normalizedName = username.toLowerCase()
                    const isUsernameTaken = await User.findOne({lcname: normalizedName})

                    if (isUsernameTaken) {
                        res.status(409).json({
                            message: 'Username already in use.'
                        })
                    } else {

                        //Username and Email are both avaiable
                        const salt = await bcrypt.genSalt(10)
                        const hashedPw = await bcrypt.hash(password, salt)
                        const newUser = new User({
                            name: username,
                            lcname: normalizedName,
                            email: normalizeEmail,
                            password: hashedPw,

                        })

                        await newUser.save()

                        res.json({
                            message: 'Registration successful.'
                        })

                    }
                }

            } catch (err) {
                res.status(500).json({
                    message: err.message
                })
            }
        }
    }
]

exports.user_login_post = [
    body('username').trim().isLength({min: 2, max:20}).escape(),
    body('password').trim().isLength({min:1, max: 20})
    .matches(/^(?=.*[a-z])/).withMessage('Password must contain at least one lowercase letter'),
    
    
    
    
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({
                message: errors
            })
        } else {
            const { username , password } = req.body
            const normalizedName = username.toLowerCase()

            const theUser = await User.findOne({lcname: normalizedName})
            if (!theUser) {
                res.status(400).json({
                    message: 'Incorrect credentials'
                })
            }
            const pwMatch = await bcrypt.compare(password, theUser.password)
            if (pwMatch) {
                const token = jwt.sign({
                    _id: theUser._id
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                })

                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'
                })

                res.json({
                    message: 'Login successful.'
                })
            }
        }
    
}]