'use client'

import apiUrl from "@/app/_utils/apiEndpoint";
import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { useEffect, useState } from "react";


export default function SelectWtcTitle ({value, setValue}) {

    const [defaultItems, setDefaultItems] = useState()
    

    const getWtTitles = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/wt/get`, {
                method: 'GET',
                cache: 'no-cache',

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
            label="WT's title"
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