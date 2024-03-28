const Rating = require('../../models/ratingModel')
const debug = require('debug')('book-test:ratingController')

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