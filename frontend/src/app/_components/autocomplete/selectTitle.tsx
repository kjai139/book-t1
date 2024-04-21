'use client'

import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { useEffect, useState } from "react";


export default function SelectWtcTitle ({value, setValue}:any) {

    const [defaultItems, setDefaultItems] = useState<any[]>()
    

    const getWtTitles = async () => {
        try {
            const response = await fetch(`/api/wt/all/get`, {
                method: 'GET',
                next: {
                    revalidate: 60 * 15,
                    tags: ['updateContent']
                }

            })

            if (response.ok) {
                const responseData = await response.json()
                setDefaultItems(responseData.allWt)
                console.log(responseData)
              
            }

        } catch (err) {
            
            console.error(err)
        }
    }

    useEffect(() => {
        getWtTitles()
    }, [])



    return (
       <div className="flex w-full max-w-xs flex-col gap-2">
             { defaultItems &&
             <>
             <Autocomplete
            label="parentRef"
            variant="bordered"
            defaultItems={defaultItems}
            placeholder="Search a title"
            className="max-w-xs"
            selectedKey={value}
            onSelectionChange={setValue}
            >
            {(item) => <AutocompleteItem key={item._id}>{item.name}</AutocompleteItem>}
            </Autocomplete>
            <p className="text-default-500 text-small">Selected: {value}
            </p>
            </>
            }
        </div>
    )
}