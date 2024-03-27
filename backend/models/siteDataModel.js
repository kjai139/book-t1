const { Schema, model, models } = require('mongoose')


const siteDataSchema = new Schema({
    title: {
        type:String,
        required: true,
    },
    description: {
        type:String,
        required: true,
    },
    keywords: [String],
    metaTags: {
        type:Map,
        of:String,
    },
    lastUpdated: {
        type:Date,
        default:Date.now
    },
    footerTxt: {
        type:String,
    },
    url: {
        type:String,
    }

})

const SiteData = models.SiteData || model('SiteData', siteDataSchema)

module.exports = SiteData