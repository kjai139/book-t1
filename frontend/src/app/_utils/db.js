import mongoose from 'mongoose'

/* const { MONGO_DB } = process.env */
const MONGO_DB = process.env.MONGO_URI

if (!MONGO_DB) {
    throw new Error('MONGO_DB IS NOT DEFINED.')
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
}

export const dbConnect = async () => {
    
    try {
        if (cached.conn) {
            console.log('Existing db connection found.')
            console.log('total amount of connections:', mongoose.connections.length)
            return cached.conn
        } /* else {
            cached.conn = await mongoose.connect(MONGO_DB)
            console.log('New Db conn connected.')
            console.log('total amount of connections:', mongoose.connections.length)
            return cached.conn
        } */
        if (!cached.promise) {
            
            cached.promise = mongoose.connect(MONGO_DB).then(mongoose => {
              return mongoose
            })
        }
          cached.conn = await cached.promise
          return cached.conn
        
    } catch (err) {
        console.error(err)
        throw new Error('connection to db failed!')
    }
}
