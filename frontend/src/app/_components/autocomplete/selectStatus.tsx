'use client'

import {Autocomplete, AutocompleteItem} from "@nextui-org/react";
import { useEffect, useState } from "react";


export default function SelectWtStatus({value, setValue}) {

    const defaultItems = [
        {
            _id: 'Ongoing',
            name: 'Ongoing'
        },
        {
            _id: 'Finished',
            name: 'Finished'
        },
        {
            _id: 'Hiatus',
            name: 'Hiatus'
        }
    ]
    

    



    return (
       <div className="flex w-full max-w-xs flex-col gap-2">
             { defaultItems &&
             <>
             <Autocomplete
            label="Status"
            variant="bordered"
            defaultItems={defaultItems}
            placeholder="Choose a status"
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