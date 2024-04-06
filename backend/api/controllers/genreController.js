const Genre = require('../../models/genreModel')
const Wt = require('../../models/wtModel')
const debug = require('debug')('book-test:genreController')
const mongoose = require('mongoose')
const Wtc = require('../../models/WTChapterModel')

exports.genres_get = async (req, res) => {
    try {
        const allGenres = await Genre.find().sort({name: 1})

        res.json({
            genres: allGenres
        })



    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.genres_all_params_get = async (req, res) => {
    try {
        const allGenres = await Genre.find()
        res.json({
            allGenres: allGenres
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}


exports.genre_wt_byGenre_get = async (req, res) => {
    debug(req.query)
    
     
     
        try {
            const limit = 3
            const { status, sort } = req.query
            const page = Number(req.query.page)
            const lcname = req.query.name.replace(/-/g, ' ')
            const genre = await Genre.find({lcname:lcname})
            debug('genre', genre)
            const genreId = genre[0]._id
            debug('genreId', genreId)
            let matchStage = {
                $match: {
                    
                }
            }
            let countQuery = {
               
            }
            let sortCondition = {

            }
            const skip = (page - 1) * limit
            if (status) {
                matchStage.$match.status = status
                countQuery.status = status
            }
            if (genre) {
                
                matchStage.$match.genres = genreId
                countQuery.genres = genreId
            }
            if (sort === 'latest') {
                sortCondition = {
                    updatedOn: -1
                }
            } else if (sort === 'rating') {
                sortCondition = {
                    avgRating: -1,
                    updatedOn: -1
                }
            }
            const totalWt = await Wt.countDocuments(countQuery)
            
            const totalPages = Math.ceil(totalWt / limit)
           
            
            
    
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
                    $sort: {
                        "book.updatedOn": -1
                    }
                }
            ])
            debug('genre filter', updates)
    
            res.json({
                wts: updates,
                totalPages: totalPages
            })
    
        } catch (err) {
            debug('error in query read', err)
            res.status(500).json({
                message: err.message
            })
        }


        
   
}