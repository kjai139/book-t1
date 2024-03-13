const { S3Client } = require('@aws-sdk/client-s3')

require('dotenv').config()

const s3Client = new S3Client({
    region: 'us-east-2',
    credentials: {
        accessKeyId: process.env.S3_KEY,
        secretAccessKey: process.env.S3_SECRET
    }
})

module.exports = s3Client