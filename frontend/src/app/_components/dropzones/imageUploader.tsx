import Image from "next/image"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

interface ImageUploaderProps {
    setImageArr: any,
    imageArr: any
}



export default function ImageUploader ({setImageArr, imageArr}: ImageUploaderProps) {

    const onDrop = useCallback((acceptedFiles:File[]) => {
        setImageArr([])
        let loadedImages = []
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()
            reader.onload = () => {
                const img = new window.Image()
                img.onload = () => {
                    loadedImages.push( { file, width:img.naturalWidth, height: img.naturalHeight })
                    /* setImageArr((prev) => [
                        ...prev, 
                        { file, width:img.naturalWidth, height: img.naturalHeight }
                    ]) */
                    if (loadedImages.length === acceptedFiles.length){
                        const sortedFiles = loadedImages.sort((a, b) => {
                            return acceptedFiles.indexOf(a.file) - acceptedFiles.indexOf(b.file)
                        })
                        setImageArr(loadedImages)
                    }

                }
                img.src = reader.result as string
            }
            reader.onerror = (error) => {
                console.error('error in filereader', error)
            }
            reader.readAsDataURL(file)
        })
        console.log(acceptedFiles)
        
    }, [])
    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps
    } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        
    })

    

    

    
    
    const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
        {file.path} - {file.size} bytes
        <ul>
        {errors.map(e => (
            <li key={e.code}>{e.message}</li>
        ))}
        </ul>
    </li>
    ));


    return (
        <section className="container">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop images here, or click to select some</p>
          <em>(Only jpeg and png)</em>
        </div>
        <aside>
          <h4>Accepted files</h4>
          <ul>{imageArr &&

            imageArr.map((file) => {    
            return (
                <li key={file.file.path}>
                <p>{file.file.path} - {file.file.size} bytes</p>
                </li>
            )
            })
          }</ul>
          <h4>Rejected files</h4>
          <ul>{fileRejectionItems}</ul>
          <ul>{imageArr && imageArr.length > 0 &&
            imageArr.map((file) => {
                let imgURL = URL.createObjectURL(file.file)   
                
                
              
                
               
            return (
                <li key={file.file.path}>
                  <div className="flex flex-col">
                  <Image src={imgURL} alt="preview" width={file.width} sizes="100vw" height={file.height} style={{
                    width:'100%',
                    height:'auto',
                  }}></Image>
                  </div>
                </li>
            )
            })

          }</ul>
        </aside>
      </section>
    )
}