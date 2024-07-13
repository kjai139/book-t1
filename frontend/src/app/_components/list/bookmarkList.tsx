import NextImage from "next/image"

interface BookmarkListProps {
    bookmarks: any[] | null | undefined
}

export default function BookmarkList ({bookmarks}:BookmarkListProps) {
    return (
        <ul>
            {bookmarks && bookmarks.map((bm:any) => {
                console.log('***GENRES***', bm.wtRef.genres)
                return (
                    <li key={bm._id}>
                        <div className="flex">
                            <div className="mr-4">
                            <NextImage className="w-[80px] h-auto" unoptimized width={100} height={0} alt={`Cover image of ${bm.wtRef.name}`} src={bm.wtRef.image}></NextImage>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold">
                                    {bm.wtRef.name}
                                </span>
                                <span className="text-sm flex gap-2 text-default-500">
                                    {bm.wtRef.genres && bm.wtRef.genres.map((genre:any) => {
                                        return (
                                            <span key={`${bm._id}-${genre._id}`}>
                                                {genre.name}
                                            </span>
                                        )
                                    })}

                                </span>
                            
                            </div>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}