import Rating from "@/app/_components/rating/starRating";
import apiUrl from "@/app/_utils/apiEndpoint";
import { Button, Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";
import { IoBookmarkOutline } from "react-icons/io5";


export async function generateStaticParams() {
    const response = await fetch(`${apiUrl}/api/wt/all/getParams`)

    const wts = await response.json()

    return wts.allWt.map((wt) => {
        let slug = wt.name.toLowerCase().replace(/ /g, "-")
        return (
            {
                wtName: slug,
            }
        )
    })
}

async function getWts(params) {
    console.log('PARAMS IN getWTS:', params)
    const response = await fetch(`${apiUrl}/api/wt/one/get?name=${params.wtName}`)

    const wt = await response.json()

    return wt
}

export default async function WtPage({params}) {
    const wt = await getWts(params)
    console.log('WTPAGE wt:', wt)

    return (
        <Card>
            <CardHeader>
                <h3 className="text-center w-full text-lg font-semibold">{wt.wt.name}</h3>
            </CardHeader>
            <CardBody className="gap-4">
                <Image src={wt.wt.image} alt={`Cover image of ${wt.wt.name}`}></Image>
                <Button startContent={<IoBookmarkOutline></IoBookmarkOutline>} variant="light" className="text-md font-semibold" aria-label="Add to Bookmark">Bookmark</Button>
                <div className="flex">
                    <Rating rating={5}></Rating>
                </div>
                <span className="text-sm">
                    <p>{wt.wt.about}</p>
                </span>
                <div className="flex gap-1">
                    <Button>
                        Read first chapter
                    </Button>
                    <Button>
                        Read last chapter
                    </Button>
                </div>
                <div className="flex flex-col">
                    <table>
                        <tbody className="text-sm">
                            <tr className="flex gap-2">
                                <td className="border-r-1 flex-1">Status</td>
                                <td className="flex-1 text-default-500">{wt.wt.status}</td>
                            </tr>
                            <tr className="flex gap-2">
                                <td className="border-r-1 flex-1">Released Year</td>
                                <td className="flex-1 text-default-500">{wt.wt.releasedYear}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
            </CardBody>
        </Card>
    )
}