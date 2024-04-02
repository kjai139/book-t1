const Rating = require('../../models/ratingModel')
const debug = require('debug')('book-test:ratingController')
const mongoose = require('mongoose')
const Wt = require('../../models/wtModel')

exports.rating_add_post = async (req, res) => {
    try {
        const { wtId, rating, tempId } = req.body
        debug('rating add', wtId, rating, tempId)
        const hasUserRated = await Rating.findOne({wtRef: wtId, ratedBy: tempId})
        if (hasUserRated) {
            res.status(409).json({
                message: 'You have already rated this.',
                code: 409
            })
        } else {
            const newRating = new Rating({
                wtRef: wtId,
                ratedBy: tempId,
                rating: Number(rating)
            })

            await newRating.save()
            res.json({
                message: 'Thanks for your rating!'
            })
        }

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}

exports.rating_wt_check = async (req, res) => {
    try {
       /*  const results = await Rating.aggregate([
            {
                $match: {
                    wtRef:mongoose.Types.ObjectId.createFromHexString(req.query.wtId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalRating: { $sum: "$rating"},
                    totalCount: {$sum: 1}, //counts all docs that matched 
                }
            },
            {
                $project : {
                    wtRef: 1,
                    totalRating: 1,
                    totalCount: 1,
                    averageRating: {
                        $divide: [
                            "$totalRating", "$totalCount"
                        ]
                    }
                }
            }
        ]) */
        // dont have to aggregate on query when you can jusst set post in the models with a function that runs on rating creation

        const results = await Wt.findById(req.query.wtId)

        const didUserRate = await Rating.findOne({wtRef: req.query.wtId, ratedBy: req.query.tempId})

        res.json({
            results: results.avgRating,
            didUserRate: didUserRate
        })


    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}