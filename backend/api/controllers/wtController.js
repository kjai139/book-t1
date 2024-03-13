const Wt = require('../../models/wtModel')
require('dotenv').config()

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
        const s3Url = `https://${bucketName}.s3.us-east-2.amazonaws.com/{${req.file.key}`

        const newWt = new Wt({
            name: name,
            genres: genres,
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