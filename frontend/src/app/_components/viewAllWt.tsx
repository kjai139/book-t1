'use client'

import { useState } from "react"
import SelectGenres from "./checkboxes/selectGenres"


export default function ViewallWt () {

    const [genres, setGenres] = useState([])

    return (
        <div className="p-2">
            <SelectGenres value={genres} setValue={setGenres}></SelectGenres>

        </div>
    )
}