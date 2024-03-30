'use client'

import { useEffect } from "react"

interface localStorageSaveHistoryProps {
    chName: string,
    chNum: string,
    wtRef: string
}


export default function LocalStorageSaveHistory ({chName, chNum, wtRef}:localStorageSaveHistoryProps) {

    useEffect(() => {
        let savedHistory = localStorage.getItem(wtRef)
        let formattedName = chName.replace('-', ' ')
        let url = `/read/${chName}/${chNum}`
        if (savedHistory) {
            savedHistory = JSON.parse(savedHistory)
            if (Array.isArray(savedHistory) && savedHistory.length === 2) {
                savedHistory.pop()
            }
            if (Array.isArray(savedHistory) && !savedHistory.some(obj => obj.url.includes(url))) {
                const entry = {
                    url: url,
                    name: formattedName
                }
                savedHistory.unshift(entry)
                
                localStorage.setItem(wtRef, JSON.stringify(savedHistory))

            } else {
                console.log(`saved history already includes chapter`)
            }
        } else {
            let newHistory = []
            let newEntry = {
                url: url,
                name: formattedName
            }
            newHistory.push(newEntry)
            const newHistoryString = JSON.stringify(newHistory)
            localStorage.setItem(wtRef, newHistoryString)
        }
    },[])


    return null
}