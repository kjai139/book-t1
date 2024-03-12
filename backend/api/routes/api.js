const express = require('express')
const { user_createUser_post, user_login_post, user_logout_post } = require('../controllers/userController')
const { checkJwt } = require('../middleware/checkJwt')
const { auth_check_get } = require('../controllers/authController')
const { genres_get } = require('../controllers/genreController')
const { wt_get_all } = require('../controllers/wtController')
const router = express.Router()


router.post('/user/create', user_createUser_post)

router.post('/user/login', user_login_post)

router.post('/user/logout', user_logout_post)

router.get('/auth/check', checkJwt, auth_check_get)

router.get('/genres/get', genres_get)

router.get('/wt/get', wt_get_all)


module.exports = router