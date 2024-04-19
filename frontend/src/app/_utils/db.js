import mongoose from 'mongoose'

const { MONGO_DB } = process.env

if (!MONGO_DB) {
    throw new Error('MONGO_DB IS NOT DEFINED.')
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null }
}

export const dbConnect = async () => {
    
    try {
        if (cached.conn) {
            console.log('Existing db connection found.')
            console.log('total amount of connections:', mongoose.connections.length)
            return cached.conn
        } else {
            cached.conn = await mongoose.connect(MONGO_DB)
            console.log('New Db conn connected.')
            console.log('total amount of connections:', mongoose.connections.length)
            return cached.conn
        }
        
    } catch (err) {
        throw new Error('connection to db failed!')
    }
}