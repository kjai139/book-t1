import BreadCrumbs from "@/app/_components/breadcrumbs/breadcrumb";
import SaveBookmarkBtn from "@/app/_components/button/saveBookmark";
import ChList from "@/app/_components/list/chList";
import Rating from "@/app/_components/rating/starRating";
import apiUrl from "@/app/_utils/apiEndpoint";
import { Button, Card, CardBody, CardHeader, Divider, Image } from "@nextui-org/react";
import { notFound } from "next/navigation";
import { IoBookmarkOutline } from "react-icons/io5";




async function getWts(params) {
    console.log('PARAMS IN getWTS:', params)
    try {
        const response = await fetch(`${apiUrl}/api/wt/one/get?name=${params.wtName}`, {
            next: {
                revalidate: 86400
            }
        })

        if (!response.ok) {
            throw new Error('ERROR FETCHING getWts')
        }

        const chResponse = await fetch(`${apiUrl}/api/wt/ch/count/get?name=${params.wtName}`, {
            next: {
                revalidate: 1
            }
        })

        if (!chResponse.ok) {
            throw new Error('ERROR FETCHING WT CHP in getWts')
        }

        const wt = await response.json()
        const ch = await chResponse.json()
        wt.totalCh = ch.totalCh

        return wt

    } catch (err) {
        console.error(err)
    }
    
    

}

export default async function WtPage({params}) {
    const wt = await getWts(params)
    console.log('WTPAGE wt:', wt)
    if (!wt) {
        notFound()
    }

    
    const table = [
            {
                name:'Status',
                value: wt.wt.status
            },
            {
                name: 'Released Year',
                value: wt.wt.releasedYear
            },
            {
                name: 'Author',
                value: wt.wt.author
            },
            {
                name: 'Artist(s)',
                value: wt.wt.artist
            },
            {
                name:'TL Group',
                value: wt.wt.tlGroup
            }
        ]
    

    

    return (
        <div className="justify-center items-center">
        <Card className="max-w-[1024px]">
            <CardHeader>
                <h3 className="text-center w-full text-lg font-semibold">{wt.wt.name}</h3>
            </CardHeader>
            <CardBody className="gap-4 items-center">
                <BreadCrumbs wtUrl={wt.wt.name}></BreadCrumbs>
                <Image src={wt.wt.image} alt={`Cover image of ${wt.wt.name}`} className="sm:max-h-[240px]"></Image>
                <SaveBookmarkBtn image={wt.wt.image} wTstatus={wt.wt.status} wtName={wt.wt.name} wtGenres={wt.wt.genres}></SaveBookmarkBtn>
                <div className="flex w-full">
                    <Rating wtId={wt.wt._id}></Rating>
                </div>
                <span className="text-sm">
                    <p>{wt.wt.about}</p>
                </span>
                <div className="flex gap-1 justify-evenly">
                    <Button>
                        First Chapter
                    </Button>
                    <Button>
                        Latest Chapter
                    </Button>
                </div>
                <div className="flex flex-col w-full">
                    <table>
                        <tbody className="text-sm">
                            {table.map((node, idx) => {
                                return (
                                    <tr className="flex gap-2 text-xs sm:text-md" key={`tr-${idx}`}>
                                        <td className="border-r-1 border-default-400 flex-1 text-default-600 p-1">
                                            <p>{node.name}</p>
                                            </td>
                                        <td className="flex-1 text-default-500 p-1">{node.value}</td>
                                    </tr>
                                )
                            })}
                            
                        </tbody>
                    </table>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                {wt.wt.genres.map((genre) => {
                    return (
                        <Button key={genre._id} size="sm" radius="full">
                            {genre.name}
                        </Button>
                    )
                })}
                </div>
                <div>
                    <h3 className="font-semibold">{`Chapters for ${wt.wt.name}`}</h3>
                    <Divider className="mt-4"></Divider>
                </div>
                <ChList chs={wt.totalCh} curSlug={params.wtName}></ChList>

               
                
            </CardBody>
        </Card>
        </div>
    )
}