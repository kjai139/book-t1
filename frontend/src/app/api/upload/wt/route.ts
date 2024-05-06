import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import Wt from "@/app/_models/wt";
import { verifySession } from "@/app/_lib/dal";
import { refreshSession } from "@/app/_lib/session";
import { dbConnect } from "@/app/_utils/db";

const s3Client = new S3Client({
    region: process.env.S3_REGION as string,
    credentials: {
        accessKeyId: process.env.S3_KEY as string,
        secretAccessKey: process.env.S3_SECRET as string
    }
})


async function uploadFileToS3AndDb(fileBuffer:Buffer, filename:string, fileType:string, formData:any) {
    try {
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: `img/pub/covers/${Date.now().toString()}-${filename}`,
            Body: fileBuffer,
            ContentType: fileType
        }
    
        const command = new PutObjectCommand(params)
        await s3Client.send(command)
        //create db entry after image successfully uploaded
        try {    
            
            /* const { name, genres, about, author, status, altName, releasedYr, artist, tlGroup} = req.body */

            const name = formData.get('name')
            const genres = formData.get('genres')
            const about = formData.get('about')
            const author = formData.get('author')
            const status = formData.get('status')
            const altName = formData.get('altName')
            const releasedYr = formData.get('releasedYr')
            const artist = formData.get('artist')
            const tlGroup = formData.get('tlGroup')
        
            
            const s3Url = `https://${params.Bucket}.s3.us-east-2.amazonaws.com/${params.Key}`
            const s3CloudFrontUrl = `${process.env.S3_CLOUDFRONT}/${params.Key}`
            const genresJSON = JSON.parse(genres)
            const genresArr = genresJSON.genres

    
            
    
            const newWt = new Wt({
                name: name,
                genres: genresArr,
                about: about,
                author: author,
                status: status,
                altName: altName,
                releasedYear: releasedYr,
                artist: artist,
                image: s3CloudFrontUrl,
                tlGroup: tlGroup,
                isHot: 'No'
    
    
    
            })
    
            await newWt.save()
            return 'Upload successful.'
        } catch (error:any) {
            //clean up s3 if db upload fails
            try {
                const imgDeleteParams = {
                    Bucket: process.env.S3_BUCKET,
                    Key: params.Key,
                }
                const command = new DeleteObjectCommand(imgDeleteParams)
                await s3Client.send(command)
            } catch (s3CleanupErr:any) {
                console.error('Error during s3 cleanup.', s3CleanupErr)
            }
            
            throw new Error('db error in creating wt -> removed s3img', error)
        }
        
    } catch (err:any) {
        //s3 upload error
        throw new Error(err)
    }
    
}


export async function POST(req:NextRequest) {
    try {
        await dbConnect()
        const isLoggedIn = await verifySession()
        if (!isLoggedIn) {
            return NextResponse.json({
                message: 'User is not logged in.'
            }, {
                status: 401
            })
        } 
        
        const formData = await req.formData()
        const image:any = formData.get('image')
        console.log('api:imagefile:', image)
        if (!image) {
            return NextResponse.json({
                message: 'File is required'
            }, {
                status: 400
            })
        }
        
        //buffer from access the arraybuffer of the image that you get from arraybuffer function, the binary format
        const buffer = Buffer.from(await image.arrayBuffer())
        const s3Path = await uploadFileToS3AndDb(buffer, image.name, image.type, formData)
        console.log(`API:File upload success. URL:${s3Path}`)

        await refreshSession()
        return NextResponse.json({
            message: `File upload success. URL:${s3Path}`
        })



    } catch (err:any) {
        return NextResponse.json({
            message: err.message
        }, {
            status: 500
        })
    }
}