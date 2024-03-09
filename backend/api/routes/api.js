const express = require('express')
const { user_createUser_post, user_login_post } = require('../controllers/userController')
const router = express.Router()


router.post('/user/create', user_createUser_post)

router.post('/user/login', user_login_post)


module.exports = router