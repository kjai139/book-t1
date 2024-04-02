'use client'
import SortByRadio from "./radio/sortByRadio";

export default function ViewGenreWt ({wtsArr}) {

    console.log(wtsArr)

    return (
        <div className="p-2 flex flex-col gap-6">
            <SortByRadio></SortByRadio>
        </div>
    )
}