const express = require('express')
const { user_createUser_post, user_login_post, user_logout_post, user_verification_confirm, user_verification_sendmail } = require('../controllers/userController')
const { checkJwt, checkJwtAdmin } = require('../middleware/checkJwt')
const { auth_check_get } = require('../controllers/authController')
const { genres_get, genres_all_params_get, genre_wt_byGenre_get } = require('../controllers/genreController')
const { wt_get_all, wt_create, wtc_create, wt_updates_get, wt_getOne, wt_search, wt_query_get, wt_meta_get, wt_views_inc, wt_rankings_get } = require('../controllers/wtController')
const router = express.Router()
const multer = require('multer')
const multerS3 = require('multer-s3')
const s3 = require('../../s3Client')
const { wtc_ch_count_get } = require('../controllers/wtcController')
const { wtp_get_all, wtp_get_content } = require('../controllers/wtpController')
const { rating_add_post, rating_wt_check } = require('../controllers/ratingController')
const { siteData_get } = require('../controllers/metaController')
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
        contentType: multerS3.AUTO_CONTENT_TYPE,
        

    })
})


router.post('/user/create', user_createUser_post)

router.post('/user/login', user_login_post)

router.post('/user/logout', user_logout_post)

router.get('/auth/check', checkJwt, auth_check_get)

router.get('/genres/get', genres_get)

router.get('/wt/get', wt_get_all)

router.post('/wt/create', upload.single('image'), wt_create)
//took out check admin
router.post('/wtc/create', upload.array('images'), wtc_create)

router.get('/wt/updates/get', wt_updates_get)

router.get('/wt/all/getParams', wt_get_all)

router.get('/wt/one/get', wt_getOne)

router.get('/wt/ch/count/get', wtc_ch_count_get)

router.get('/wtpage/get', wtp_get_all)

router.get('/wtpage/getch', wtp_get_content)

router.get('/wt/search', wt_search)

router.get('/wts/all/get', wt_query_get)

router.get('/user/verify', user_verification_confirm)

router.post('/user/verify/send', checkJwt, user_verification_sendmail)

router.post('/rating/add', rating_add_post)

router.get('/ratings/get', rating_wt_check )

router.get('/metadata/get', siteData_get)

router.get('/genres/all/getParams', genres_all_params_get)

router.get('/genre/wts/get', genre_wt_byGenre_get)

router.get('/wt/meta/get', wt_meta_get)

router.post('/wt/views/add', wt_views_inc)

router.get('/wt/rankings/get', wt_rankings_get)

module.exports = router