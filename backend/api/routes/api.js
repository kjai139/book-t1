const express = require('express')
const { user_createUser_post, user_login_post, user_logout_post } = require('../controllers/userController')
const { checkJwt } = require('../middleware/checkJwt')
const { auth_check_get } = require('../controllers/authController')
const { genres_get } = require('../controllers/genreController')
const { wt_get_all, wt_create, wtc_create, wt_updates_get } = require('../controllers/wtController')
const router = express.Router()
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = require('../../s3Client')
require('dotenv').config()

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        metadata: function(req, file, cb) {
            cb(null, {
                fieldName: file.fieldname,

            })
        },
        key: function(req, file, cb) {
            
            cb(null, `img/pub/${req.headers['directory-name']}/${Date.now().toString()}-${file.originalname}`)
        },
        contentType: multerS3.AUTO_CONTENT_TYPE

    })
})


router.post('/user/create', user_createUser_post)

router.post('/user/login', user_login_post)

router.post('/user/logout', user_logout_post)

router.get('/auth/check', checkJwt, auth_check_get)

router.get('/genres/get', genres_get)

router.get('/wt/get', wt_get_all)

router.post('/wt/create', upload.single('image'), wt_create)

router.post('/wtc/create', upload.array('images'), wtc_create)

router.get('/wt/updates/get', wt_updates_get)


module.exports = router