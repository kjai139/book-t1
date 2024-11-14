import { Image } from "@nextui-org/react"

interface NextUiImgProps {
    url: string,
    classNames?:string,
    altName: string
}

export default function NextUiImg ({url, classNames, altName}:NextUiImgProps) {

    return (
       
        <Image isZoomed alt={`picture of ${altName}`} src={url} radius="none" classNames={{
            zoomedWrapper: 'max-w-[100%]',
            wrapper: 'nextUImgwrap'
        }} style={{
            height:'200px',
            width:'100%',
            
        }}>

        </Image>

       
        
    )
}