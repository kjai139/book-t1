const SiteData = require('../../models/siteDataModel')
const debug = require('debug')('book-test:metaController')

//migrate serv component
exports.siteData_get = async (req, res) => {
    try {
        const siteData = await SiteData.findOne()
        debug('siteData', siteData)
        res.json({
            siteData
        })

    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
}