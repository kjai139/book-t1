
interface BookmarkListProps {
    bookmarks: any[] | null | undefined
}

export default function BookmarkList ({bookmarks}:BookmarkListProps) {
    return (
        <ul>
            {bookmarks && bookmarks.map((bm:any) => {
                return (
                    <li key={bm._id}>
                        <div>
                            {bm.wtRef.name}
                        </div>
                    </li>
                )
            })}
        </ul>
    )
}