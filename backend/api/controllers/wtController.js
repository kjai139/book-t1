const Wt = require('../../models/wtModel')
const Wtc = require('../../models/WTChapterModel')
require('dotenv').config()
const debug = require('debug')('book-test:wtController')
const WtPage = require('../../models/WtPageModel')
const mongoose = require('mongoose')
const { isToday, startOfMonth, startOfDay, endOfMonth, isSameDay } = require('date-fns')
const SiteData = require('../../models/siteDataModel')


//migrate to route handler generating wt params
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
            updatedOn: Date.now(),
        }, {
            new: true
        })
        if (!updatedParentWT.slug) {
            const removeCommaStr = updatedParentWT.name.replace(/,/g, '')
            updatedParentWT.slug = removeCommaStr.toLowerCase().replace(/\s+/g, '-') 
            await updatedParentWT.save()
        }
        
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

        const slider = await Wt.aggregate([
            {
                $lookup: {
                    from: 'genres',
                    localField: 'genres',
                    foreignField: '_id',
                    as: 'genres'
                }//serves as populate
            }
        ]).sample(6)

        debug('SLIDER RESULT', slider)

        res.json({
            updates: updates,
            totalPages: totalPages,
            slider: slider
        })

    } catch (err) {
        debug('ERROR IN UPDATES GET:', err)
        res.status(500).json({
            message: err.message
        })
    }
}

//migrated to get wt in route handler 
exports.wt_getOne = async ( req, res ) => {

    try {
        
        const wt = await Wt.findOne({slug: req.query.name}).populate('genres')

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


exports.wt_search = async (req, res) => {
    try {
        const escapedTxt = req.query.name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        
        const regex = new RegExp(escapedTxt, 'i')
        
        const results = await Wt.find({
            name: {
                $regex: regex
            }
        }).populate('genres')

        res.json({
            results: results
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

//migrate api/wt/query
exports.wt_query_get = async (req, res) => {
    try {
        const limit = 20
        const { status, order, page} = req.query
        console.log('WT QUERY GET:STATUS ORDER PAGE-', status, order, page)
        const genres = JSON.parse(req.query.genres)
        const genresObjIds = genres.map(id => mongoose.Types.ObjectId.createFromHexString(id))
        let matchStage = {
            $match: {
                
            }
        }
        let countQuery = {
           
        }
        let sortCondition = {

        }
        let aggreSortCondition = {

        }
        const skip = (page - 1) * limit
        if (status) {
            matchStage.$match.status = status
            countQuery.status = status
        }
        if (genres.length > 0) {
            matchStage.$match.genres = {
                $all: genresObjIds
            }
            countQuery.genres = {
                $all: genres
            }
        }
        if (order === 'latest') {
            sortCondition = { updatedOn : -1}
            aggreSortCondition = {
                "book.updatedOn": -1
            }
        } else if (order === 'rating') {
            sortCondition = {
                avgRating: -1,
                updatedOn: -1
            }
            aggreSortCondition = {
                "book.avgRating": -1,
                "book.updatedOn": -1
            }
        }
        const totalWt = await Wt.countDocuments(countQuery)
        
        const totalPages = Math.ceil(totalWt / limit)
        debug('genres in q', genres)
        
        

        const updates = await Wt.aggregate([
            matchStage,
            {
                $sort: sortCondition
            },
            {
                $skip: skip

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
                $sort: aggreSortCondition
            }
        ])

        res.json({
            wts: updates,
            totalPages: totalPages,
            totalWt: totalWt
        })

    } catch (err) {
        debug('error in query read', err)
        res.status(500).json({
            message: err.message
        })
    }
}

//migrated to route handler getwt + getwtpage
exports.wt_meta_get = async (req, res) => {
    try {
        const wt = await Wt.findOne({slug: req.query.name})
        console.log('FROM WT META GET', wt, req.query.name)
        res.json({
            wt: wt
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}


exports.wt_views_inc = async (req, res) => {
    const today = startOfDay(new Date())
    const result = isToday(startOfMonth(today))
    //if today is the 1st day of the month
    if (result) {
        const newExpire = endOfMonth(today)
        try {

            const siteData = await SiteData.findOne()
            if (!siteData) {
                debug('Error finding siteData')
                res.status(500).json({
                    message: 'Error finding siteData'
                })
            }
            const doesExpireMatch = isSameDay(siteData.monthlyExpire, newExpire)
            if (!doesExpireMatch) {
                siteData.monthlyExpire = newExpire
                await siteData.save()
                res.json({
                    message: `New expire date for views updated to ${newExpire}`
                })
            } else if (doesExpireMatch) {
                await Wt.findOneAndUpdate({slug: req.body.wtName}, {
                    $inc: {
                        monthlyViews: 1
                    }
                })
                res.json({
                    message: 'Monthly view updated'
                })
            }
            

        } catch (err) {
            debug('Error in inc views', err)
            res.status(500).json({
                message: err.message
            })
        }
        //if it's any other day
    } else {
        await Wt.findOneAndUpdate({slug: req.body.wtName}, {
            $inc: {
                monthlyViews: 1
            }
        })
        res.json({
            message: 'Monthly view updated'
        })
    }

}

//migrate route handler getwt

exports.wt_rankings_get = async (req, res) => {
    try {
        const monthlyRanking = await Wt.find({}).sort({monthlyViews: -1, name: -1}).limit(10).populate('genres')
        debug('MONTHLY RANKING:', monthlyRanking)
        res.json({
            rankings:monthlyRanking
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}