import mongoose from "mongoose"
const Schema = mongoose.Schema


const StatusSchema = new Schema({
    name: {
        type:String,
        required: true,
        unique:true
    },
    slug: {
        type:String,
        unique:true
    }
})

export default mongoose.models.Status || mongoose.model('Status', StatusSchema)