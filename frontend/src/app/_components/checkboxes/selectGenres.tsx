'use client'

import apiUrl from "@/app/_utils/apiEndpoint";
import {CheckboxGroup, Checkbox} from "@nextui-org/react";
import { useEffect, useState } from "react";




export default function SelectGenres ({value, setValue}:any) {

    const [defaultItems, setDefaultItems] = useState<any>()


    const getGenres = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/genres/get`, {
                method: 'GET',
                next: {
                    revalidate: 60 * 60
                }

            })

            if (response.ok) {
                const responseData = await response.json()
                setDefaultItems(responseData.genres)
                /* console.log(responseData) */
              
            }

        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getGenres()
    }, [])

    /* useEffect(() => {
        console.log(value)
    }, [value]) */



    return (
       <div className="flex w-full flex-col gap-2">
             { defaultItems &&
             <>
             <CheckboxGroup
             label="By Genres"
             color="primary"
             value={value}
             onValueChange={setValue}
             orientation="horizontal"
             >
                {defaultItems.map((node:any, idx:number) => {
                return (
                    <Checkbox key={`check-${idx}`} value={node._id}>{node.name}</Checkbox>
                )
             })}
             </CheckboxGroup>
             
            {/*  <p>Selected: {value.join(', ')}</p> */}
            </>
            }
        </div>
    )
}