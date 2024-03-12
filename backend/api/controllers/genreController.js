const Genre = require('../../models/genreModel')


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