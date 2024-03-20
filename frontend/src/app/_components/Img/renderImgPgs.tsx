import Image from "next/image"


interface RenderImgsProps {
    imgs: any
}

export default function RenderImgs ({img}:RenderImgsProps) {

    console.log(img)

    return (
        <Image src={img.url} alt="Image" width={img.imgWidth} height={img.imgHeight}>

        </Image>
    )
}