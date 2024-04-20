import { NextRequest, NextResponse } from "next/server";
import Wtc from "@/app/_models/wtChapter";
import { s3Client } from "@/app/_lib/s3Client";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import WtPage from "@/app/_models/wtPage";
import Wt from "@/app/_models/wt";

async function uploadToS3AndCreatePg(fileBuffer:Buffer, filename:string, fileType:string, pageNum:number, dirName:string, chRef:string, height:string, width:string) {
    try {
        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: `img/pub/${dirName}/${Date.now().toString()}-${filename}`,
            Body: fileBuffer,
            ContentType: fileType
        }
    
        const command = new PutObjectCommand(params)
        await s3Client.send(command)
        //create db entry after image successfully uploaded
        try {   
            const s3Url = `https://${params.Bucket}.s3.us-east-2.amazonaws.com/${params.Key}` 
            let newPage = new WtPage({
                pageNum: pageNum + 1,
                url: s3Url,
                chapterRef: chRef,
                imgHeight: Number(height),
                imgWidth: Number(width)

            })

            await newPage.save()
            
            
            console.log(`image/page ${pageNum} saved. imgURL:${s3Url}`)
            return true
        } catch (error:any) {
            //throw error to clean all pages    
            throw new Error('db error in creating wt -> removed s3img', error)
        }
        
    } catch (err:any) {
        //s3 upload error
        throw new Error(err)
    }
    
}


export async function POST(req:NextRequest) {
    try {
        const formData = await req.formData()
        const name = formData.get('name')
        const chapterNumber = formData.get('chapterNumber')
        const parentRef = formData.get('parentRef')

        const images = formData.get('images')
        const NumOfImages = Number(formData.get('imgL'))
        console.log('API-UPLOAD-images:', images)

        const newChapter = new Wtc({
            name: name,
            chapterNumber: Number(chapterNumber),
            wtRef: parentRef
        })

        await newChapter.save()

        for (let i = 0; i < NumOfImages; i++ ) {
            const idx = i
            const img:any = formData.get(`images-${idx}`)
            const width:any = formData.get(`widths-${idx}`)
            const height:any = formData.get(`heights-${idx}`)
            console.log(`img-${idx}:`, img, `${width} x ${height}`)
            const buffer = Buffer.from(await img.arrayBuffer())
            await uploadToS3AndCreatePg(buffer, `img-${idx}`, img.type, idx, `${parentRef}-${chapterNumber}`, newChapter._id, height, width)
        }
         

        const updatedParentWT = await Wt.findByIdAndUpdate(parentRef, {
            updatedOn: Date.now(),
        }, {
            new: true
        })
        if (!updatedParentWT.slug) {
            const removeCommaStr = updatedParentWT.name.replace(/,/g, '')
            updatedParentWT.slug = removeCommaStr.toLowerCase().replace(/\s+/g, '-') 
            await updatedParentWT.save()
        }
        
        return NextResponse.json({
            message: 'Chapter upload successful.'
        })

    } catch (err:any) {
        console.log('UPLOAD CHAPTER UNSUCCESSFUL')
        return NextResponse.json({
         message: err.message
        }, {
            status: 500
        })
        
    }
}