const Wt = require('../../models/wtModel')

exports.wt_get_all = async (req, res) => {
    try {
        const allWt = await Wt.find().sort({name: 1})
        
        res.json({
            allWt: allWt
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}