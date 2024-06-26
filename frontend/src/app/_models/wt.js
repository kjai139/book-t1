const mongoose = require('mongoose')
const Schema = mongoose.Schema


const WTSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    genres: [{
        type: Schema.Types.ObjectId,
        ref: 'Genre'
    }],
    image: {
        type:String,

    },
    createdAt: {
        type:Date,
        default: Date.now
    },
    about: {
        type:String,
        required: true
    },
    author: {
        type: String,

    },
    artist: {
        type:String
    },
    altName: {
        type: String,
    },
    status: {
        type:String,
        enum: ['Ongoing', 'Finished', 'Hiatus']
    },
    raw: {
        type:String,
        enum: ['Korean', 'Japanese', 'English', 'Chinese'],
        default: 'Korean'
    },
    releasedYear: {
        type:String,

    },
    serialization: {
        type:String
    },
    updatedOn: {
        type:Date,

    },
    tlGroup: {
        type:String,
        default: ''
    },
    avgRating: {
        type: Number,
        default: 0
    },
    slug: {
        type:String,
        unique:true
    },
    monthlyViews: {
        type:Number,
        default: 0

    },
    totalViews: {
        type:Number,
        default: 0
    },
    isHot: {
        type:String,
        enum: ['Red', 'Orange', 'Yellow', 'No'],
        default: 'No'
    },
    scUrl: {
        type:String,
    },
    wtStatus: {
        type: Schema.Types.ObjectId,
        ref: 'Status',
    },
    isTitleNew: {
        type:Boolean,
        default: false
    }

   
})

WTSchema.methods.calculateAvgRating = async function() {
    const ratings = await mongoose.model('Rating').aggregate([
        {$match: {wtRef: this._id}},
        {$group: {_id: null, avgRating: {$avg: '$rating'} }}
    ])

    this.avgRating = ratings.length > 0 ? Math.ceil(ratings[0].avgRating * 10) / 10 : 0
    await this.save()
}

/* WTSchema.pre('save', function(next) {
    if (this.isModified('updatedOn')) {
        const slug = this.name.toLowerCase().replace(/\s+/g, '-')
    }

    next()
}) */

export default mongoose.models.WT || mongoose.model('WT', WTSchema)