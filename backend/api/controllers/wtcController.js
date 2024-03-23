const Wtc = require('../../models/WTChapterModel')
const debug = require('debug')('book-test:wtcController')
const Wt = require('../../models/wtModel')


exports.wtc_ch_count_get = async (req, res) => {
    try {
        const nameWspaces = req.query.name.replace(/-/g, " ")
        const wt = await Wt.findOne({name: nameWspaces })
        const totalCh = await Wtc.find({wtRef: wt._id}).sort({chapterNumber: -1})
        debug('from ch count get:', totalCh)
        res.json({
            totalCh: totalCh
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}