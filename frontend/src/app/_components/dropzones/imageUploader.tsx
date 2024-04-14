'use client'
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"

interface ImageUploaderProps {
    setImageArr: any,
    imageArr: any
}



export default function ImageUploader ({setImageArr, imageArr}: ImageUploaderProps) {

    const [preview, setPreview] = useState<any>([])
    
    
    const onDrop = async (acceptedFiles: File[]) => {
        setImageArr([]);
        setPreview([])
        
        
    
        const loadImage = (file) => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
    
                reader.onload = () => {
                    const img = new window.Image();
                    img.onload = () => {
                        resolve({ file, width: img.naturalWidth, height: img.naturalHeight });
                        img.onload = null;
                        reader.onload = null;
                        
                    };
                    img.onerror = () => {
                        reject(new Error('Error loading image'));
                        img.onerror = null;
                        reader.onload = null;
                    };
                    img.src = reader.result as string;
                };
    
                reader.onerror = (error) => {
                    reject(error);
                    reader.onerror = null;
                };
    
                reader.readAsDataURL(file);
            });
        };

        try {
            const loadedImages = await Promise.all(acceptedFiles.map(loadImage))
            
            const sortedFiles = loadedImages.sort((a, b) => {
                return acceptedFiles.indexOf(a.file) - acceptedFiles.indexOf(b.file);
            });
            setImageArr(sortedFiles);

            //set preview
            const dupeArr = [...sortedFiles]
            const newArr = dupeArr.map(file => ({file, preview: URL.createObjectURL(file.file)}))
            
            setPreview(newArr)

        } catch(err) {
            console.error(err)
        }
    
        
                

               
                
                
            
    }
    const {
        acceptedFiles,
        fileRejections,
        getRootProps,
        getInputProps
    } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': [],
            'image/webp': [],
            'image/gif': [],
        },
        
    })

    useEffect(() => {
        if (imageArr.length === 0) {
            
            setPreview([])
            
            
        }
        
    }, [imageArr])

       
        
            
  

    useEffect(() => {
        return () => 
            // Revoke object URLs on component unmount
            
            preview.forEach(file => URL.revokeObjectURL(file.preview));
            
       
    }, []); // Empty dependency array for component unmount cleanup

   
    

    

    

    
    
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
          <em>(jpeg png webp)</em>
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
          <ul>{preview && preview.length > 0 &&
            preview.map((file,idx) => {
                
                
                
              
                
               
            return (
                <li key={`${idx}- ${file.file.path}`}>
                  <div className="flex flex-col">
                  <Image src={file.preview} alt="preview" width={file.file.width} sizes="100vw" height={file.file.height} onLoad={() => {URL.revokeObjectURL(file.preview)}} style={{
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