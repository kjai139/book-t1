const Wtc = require('../../models/WTChapterModel')
const debug = require('debug')('book-test:wtcController')
const Wt = require('../../models/wtModel')

//migrated to wt getWts serv component
exports.wtc_ch_count_get = async (req, res) => {
    try {
        
        const wt = await Wt.findOne({slug:req.query.name })
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