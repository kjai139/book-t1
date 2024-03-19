const Wtc = require('../../models/WTChapterModel')
const debug = require('debug')('book-test:wtpController')
const Wt = require('../../models/wtModel')


exports.wtp_get_all = async (req, res) => {
    try {
        const nameWspaces = req.query.name.replace(/-/g, " ")
        const wt = await Wt.findOne({name: nameWspaces })
        if (!wt) {
            res.status(500).json({
                nameWspaces: nameWspaces,
                wt: wt
            })
        } else {
            const allCh = await Wtc.find({wtRef: wt._id})

            debug('all chapters for wtp params got')
            res.json({
                allCh: allCh
            })
        }
       

    } catch (err) {
        res.status(500).json({
            message: err.message,

        })
    }
}