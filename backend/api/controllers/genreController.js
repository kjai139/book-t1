const Genre = require('../../models/genreModel')
const Wt = require('../../models/wtModel')
const debug = require('debug')('book-test:genreController')
const mongoose = require('mongoose')
const Wtc = require('../../models/WTChapterModel')

//migrate route handler
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

//no longer needed - used in static ngen directly
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

//used in generating genre pages
exports.genre_wt_byGenre_get = async (req, res) => {
    
    
     
     
        try {
            const limit = 20
            const { status, sort } = req.query
            const page = Number(req.query.page)
            const slug = req.query.slug
            debug('slug', slug)
            const genre = await Genre.find({slug:slug})
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
            let aggSortCondition = {

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
                aggSortCondition = {
                    "book.updatedOn": -1
                }
            } else if (sort === 'rating') {
                sortCondition = {
                    avgRating: -1,
                    updatedOn: -1
                    
                }
                aggSortCondition = {
                    "book.avgRating": -1,
                    "book.updatedOn": -1
                }
            }
            const totalWt = await Wt.countDocuments(countQuery)
            
            const totalPages = Math.ceil(totalWt / limit)
           
            const sortedWt = await Wt.find().sort({
                avgRating: -1,
                updatedOn: -1
            }).skip(skip).limit(limit)
            
    
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
                        book: { $first: '$$ROOT'},
                       
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
                    $sort: aggSortCondition
                }
            ])
            debug('genre filter', updates)
    
            res.json({
                wts: updates,
                totalPages: totalPages,
                genre: genre,
                totalWt: totalWt,
                fullArr: sortedWt
            })
    
        } catch (err) {
            debug('error in query read', err)
            res.status(500).json({
                message: err.message
            })
        }


        
   
}