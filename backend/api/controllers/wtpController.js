const Wtc = require('../../models/WTChapterModel')
const debug = require('debug')('book-test:wtpController')
const Wt = require('../../models/wtModel')
const WtPage = require('../../models/WtPageModel')

//migrate route handler getpagestatic
exports.wtp_get_all = async (req, res) => {
    try {
        
        const wt = await Wt.findOne({slug: req.query.name })
        if (!wt) {
            res.status(500).json({
                name:req.query.name,
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

//migrate route handler wtp serv comp

exports.wtp_get_content = async (req, res) => {
    try {
        
        const wt = await Wt.findOne({slug: req.query.name })
        if (!wt) {
            debug('wt not found in get content')
        }
        const wtc = await Wtc.findOne({wtRef: wt._id, chapterNumber: req.query.num})
        if (!wtc) {
            debug('wtc not found in get content')
        }
        const wtPages = await WtPage.find({chapterRef: wtc._id}).sort({pageNum: 1})
        if (!wtPages) {
            debug('wtPages not found in get content')
        }

        const allWtc = await Wtc.find({wtRef: wt._id}).sort({
            chapterNumber: -1
        })

        res.json({
            wtc: wtc,
            images: wtPages,
            chList: allWtc
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}