const Genre = require('../../models/genreModel')
const Wt = require('../../models/wtModel')
const debug = require('debug')('book-test:genreController')
const mongoose = require('mongoose')

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
        const genre = await Genre.find({lcname: req.query.name.replace(/-/g, ' ')})
        debug('GenreId in byGenre', genre)
        const wts = await Wt.find({genres: { $in : [genre[0]._id]}})


        res.json({
            wts: wts
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}