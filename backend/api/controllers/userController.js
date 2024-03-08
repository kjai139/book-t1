const User = require('../../models/userModel')
const debug = require('debug')('book-test:userController')
const { validationResult } = require('express-validator')


exports.user_createUser_post = [
    body('email').matches(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/).withMessage('Non valid email format').escape(),
    body('username').trim().isLength({min: 2, max:20}).escape(),
    body('password').trim().isLength({min:1, max: 20})
    .matches(/^(?=.*[a-z])/).withMessage('Password must contain at least one lowercase letter')
    .matches(/^(?=.*[A-Z])/).withMessage('must contain at least one uppercase letter')
    .matches(/^(?=.*[!@#$%^&()_+-])/).withMessage('must have at least one special character').escape(),
    body('confirmPassword').trim().custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match')
        }
    }).escape(),

    
    
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.status(400).json({
                message: errors
            })
        } else {
            const { username, email, password } = req.body
            try {
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
                        const newUser = new User({
                            name: username,
                            lcname: normalizedName,
                            email: normalizeEmail,
                            password: password,

                        })

                        await newUser.save()

                        res.json({
                            success: true,
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