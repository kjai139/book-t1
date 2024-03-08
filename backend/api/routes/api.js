const express = require('express')
const { user_createUser_post } = require('../controllers/userController')
const router = express.Router()


router.post('/user/create', user_createUser_post)


module.exports = router