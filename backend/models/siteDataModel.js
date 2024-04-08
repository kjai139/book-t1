const { Schema, model, models } = require('mongoose')
const Wt = require('../models/wtModel')


const siteDataSchema = new Schema({
    title: {
        type:String,
        required: true,
    },
    shortDesc: {
        type:String,
        required: true
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
    },
    ogImg: {
        type:String
    },
    siteC: {
        type:String,
    },
    monthlyExpire: {
        type:Date
    }

})

const SiteData = models.SiteData || model('SiteData', siteDataSchema)

siteDataSchema.pre('save', async function(next) {
    if (this.isModified('monthlyExpire')) {
        await Wt.updateMany({}, { $set: {monthlyViews: 0}})
    }
    next()
})

module.exports = SiteData