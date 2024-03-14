const Wt = require('../../models/wtModel')
const Wtc = require('../../models/WTChapterModel')
require('dotenv').config()
const debug = require('debug')('book-test:wtController')
const WtPage = require('../../models/WtPageModel')
const sharp = require('sharp')

exports.wt_get_all = async (req, res) => {
    try {
        const allWt = await Wt.find().sort({name: 1})
        
        res.json({
            allWt: allWt
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}


exports.wt_create = async (req, res) => {
    try {
        const { name, genres, about, author, status, altName, releasedYr, artist} = req.body
        const bucketName = process.env.S3_BUCKET
        const s3Url = `https://${bucketName}.s3.us-east-2.amazonaws.com/${req.file.key}`
        const genresJSON = JSON.parse(genres)
        const genresArr = genresJSON.genres

        debug('NAME:', name)
        debug('Genres:', genresArr)

        const newWt = new Wt({
            name: name,
            genres: genresArr,
            about: about,
            author: author,
            status: status,
            altName: altName,
            releasedYear: releasedYr,
            artist: artist,
            image: s3Url



        })

        await newWt.save()
        res.json({
            message: 'New WT entry created. Cover url:', s3Url
        })




    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.wtc_create = async (req, res) => {
    try {

        const { name, chapterNumber, parentRef} = req.body
        debug(req.files)
        const newChapter = new Wtc({
            name: name,
            chapterNumber: Number(chapterNumber),
            wtRef: parentRef
        })
        
        await newChapter.save()
        for (const file of req.files) {
            let pageNum = Number(file.originalname.split('.')[0])
            let metaData = await sharp(file).metadata()
            let height = metaData.height
            let width = metaData.width
            let newPage = new WtPage({
                pageNum: pageNum,
                url: file.location,
                chapterRef: newChapter._id
            })

            await newPage.save()
        }
        
        
        res.json({
            message: 'sucess'
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}