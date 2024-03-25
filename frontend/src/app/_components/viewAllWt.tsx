'use client'

import { useState } from "react"
import SelectGenres from "./checkboxes/selectGenres"
import SelectStatusCheckbox from "./checkboxes/selectStatus"
import { Button } from "@nextui-org/react"
import apiUrl from "../_utils/apiEndpoint"



export default function ViewallWt () {

    const [genres, setGenres] = useState([])
    const [status, setStatus] = useState<String[]>([])

    const [curPg, setCurPg] = useState(1)
    const [totalPages, setTotalPages] = useState()


    const getWts = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/wts/all/get?genres=${encodeURIComponent(JSON.stringify(genres))}&status=${status}&order=${'latest'}&page=${curPg}`, {
                cache: "no-cache"
            })

            if (response.ok) {
                const data = await response.json()
                console.log(data)
            }

        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div className="p-2 flex flex-col gap-6">
            <SelectGenres value={genres} setValue={setGenres}></SelectGenres>
            <SelectStatusCheckbox value={status} setValue={setStatus}></SelectStatusCheckbox>
            <div className="justify-end flex">
                <Button  color="primary" size="sm" onPress={getWts}>Filter</Button>
            </div>
           

        </div>
    )
}