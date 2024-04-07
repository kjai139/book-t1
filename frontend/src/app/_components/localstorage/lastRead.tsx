'use client'

import { Divider, Link } from "@nextui-org/react"
import { useEffect, useState } from "react"

interface LastReadProps {
    wtId: string,
    wtName: string,
}

export default function LastRead ({wtId, wtName}:LastReadProps) {

    const [readHistory, setReadHistory] = useState([])
    const [initialized, isInitialized] = useState('done')
    

    useEffect(() => {
        if (initialized === 'done') {
            const lastRead = localStorage.getItem(wtId)
            if (lastRead) {
                const lastReadArr = JSON.parse(lastRead)
                setReadHistory(lastReadArr)
            } else {
                setReadHistory([])
            }
        }
    }, [initialized])


    return (
        <>
        {initialized == 'done' && readHistory.length > 0 &&
        <div className="flex flex-col w-full items-center">
            <span className="font-semibold text-sm text-default-500 w-full">
                <h3>Last read</h3>
            </span>
            <Divider className="mt-2 mb-2"></Divider>
        <ul className="flex flex-col gap-2 w-full">
            {readHistory.map((node, idx) => {
                let parts = node.url.split('/')
                let chNum = parts[parts.length - 1]
                return (
                    <li key={`hty${idx}`}>
                        <Link href={node.url} aria-label={`Go to chapter ${chNum}`} className="text-sm">{wtName} Chapter {chNum}</Link>
                    </li>
                )
            })}
        </ul>
        </div>
        }
        </>
    )
}