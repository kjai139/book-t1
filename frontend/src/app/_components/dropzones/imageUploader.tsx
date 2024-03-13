import Image from "next/image"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"

interface ImageUploaderProps {
    setImageArr: React.Dispatch<React.SetStateAction<File[]>>
}



export default function ImageUploader ({setImageArr}: ImageUploaderProps) {

    const onDrop = useCallback((acceptedFiles:File[]) => {
        setImageArr(acceptedFiles)
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

    

    const acceptedFileItems = acceptedFiles.map((file) => {
        let imgURL = URL.createObjectURL(file)     
    return (
        <li key={file.path}>
          <p>{file.path} - {file.size} bytes</p>
        </li>
    )
    })

    const acceptedFilesPreview = acceptedFiles.map((file) => {
        let imgURL = URL.createObjectURL(file)     
    return (
        <li key={file.path}>
          <div className="flex flex-col">
          <Image src={imgURL} alt="preview" sizes="100vw" width={720} height={4000} style={{
            width:'100%',
            height:'auto'
          }}></Image>
          </div>
        </li>
    )
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
          <ul>{acceptedFileItems}</ul>
          <h4>Rejected files</h4>
          <ul>{fileRejectionItems}</ul>
          <ul>{acceptedFilesPreview}</ul>
        </aside>
      </section>
    )
}