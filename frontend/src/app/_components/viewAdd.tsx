'use client'
import { useEffect, useState } from "react"
import { AddViews } from "../actions"

interface IncreViewsProps {
    wtName: string,
}

export default function IncreViews ({wtName}:IncreViewsProps) {

    const [initiated, setInitiated] = useState(true)

    useEffect(() => {
        if (initiated) {
            const updateViews = async () => {
                const updatedViews = await AddViews(wtName)
            }
    
            updateViews()
        }
        

    }, [])


    return (
        <></>
    )
    
}