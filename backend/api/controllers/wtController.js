const Wt = require('../../models/wtModel')
const Wtc = require('../../models/WTChapterModel')
require('dotenv').config()
const debug = require('debug')('book-test:wtController')
const WtPage = require('../../models/WtPageModel')


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
        console.log(req.file)
        const { name, genres, about, author, status, altName, releasedYr, artist, tlGroup} = req.body
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
            image: s3Url,
            tlGroup: tlGroup



        })

        await newWt.save()
        res.json({
            message: 'New WT entry created. Cover url:', s3Url
        })




    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message
        })
    }
}

exports.wtc_create = async (req, res) => {
    try {

        const { name, chapterNumber, parentRef} = req.body
        debug(req.files)
        debug(req.body)
        const newChapter = new Wtc({
            name: name,
            chapterNumber: Number(chapterNumber),
            wtRef: parentRef
        })

        await newChapter.save()
        
        
        for (let i = 0; i < req.files.length; i++) {
            /* let idx = file[i].originalname.split('.')[0] */
            /* let pageNum = Number(file.originalname.split('.')[0]) */
            let idx = i
            let pageNum = i + 1
            let height = Number(req.body[`heights-${idx}`])
            let width = Number(req.body[`widths-${idx}`])
            let newPage = new WtPage({
                pageNum: pageNum,
                url: req.files[i].location,
                chapterRef: newChapter._id,
                imgHeight: height,
                imgWidth: width

            })

            await newPage.save()
        }
        

        const updatedParentWT = await Wt.findByIdAndUpdate(parentRef, {
            updatedOn: Date.now()
        }, {
            new: true
        })
        
        
        res.json({
            message: 'sucess'
        })

    } catch (err) {
        debug(err)
        res.status(500).json({
            message: err.message
        })
    }
}

exports.wt_updates_get = async (req, res) => {
    const sevendaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

    const page = Number(req.query.page)
    const limit = 50

    try {
        const updates = await Wt.aggregate([
            {
                $match: {
                    updatedOn: { $gte: sevendaysAgo }
                }
            },
            {
                $sort: { updatedOn: -1}
            },
            {
                $skip: (page - 1) * limit

            },
            {
                $limit: limit
            },
            {
                $lookup: {
                    from: Wtc.collection.name,
                    localField: '_id',
                    foreignField: 'wtRef',
                    as: 'chapters'
                    //localField(cur collection) matches the foreignfield(from collection)
                }
            },
            {
                $unwind: '$chapters'
            },
            {
                $sort: { 'chapters.chapterNumber': -1 }
            },
            {
                $group: {
                    //grouping by the Book's id
                    _id: '$_id',
                    chapters: { $push: '$chapters' },
                    book: { $first: '$$ROOT'}
                }
            },
            {
                $project: {
                    _id: 0,
                    book: 1,
                    chapters: { $slice: ['$chapters', 2]}
                }
            },
            {
                $unset: "book.chapters"
            },
            {
                $sort: {
                    "book.updatedOn": -1
                }
            }
        ])

        debug('HOME RESULTS:', updates)
        debug('CHAPTERS:', updates.chapters )

        const totalCount = await Wt.countDocuments({
            updatedOn: { $gte: sevendaysAgo }
        })

        const totalPages = Math.ceil(totalCount / limit)

        res.json({
            updates: updates,
            totalPages: totalPages
        })

    } catch (err) {
        debug('ERROR IN UPDATES GET:', err)
        res.status(500).json({
            message: err.message
        })
    }
}

exports.wt_getOne = async ( req, res ) => {

    try {
        const nameWspaces = req.query.name.replace(/-/g, " ")
        const wt = await Wt.findOne({name: nameWspaces}).populate('genres')

        const wtChapters = await Wtc.find({wtRef: wt._id}).sort({chapterNumber: -1})

        res.json({
            wt: wt,
            wtc: wtChapters
        })


    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}