import apiUrl from "@/app/_utils/apiEndpoint";
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useCallback, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function NavSearch () {

    const [query, setQuery] = useState('')

    const debounce = useCallback((callback, delay) => {
        let timeoutId
    
        return (...args) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => callback(...args), delay)
        }
    }, [])

    const search = useCallback(async (input:string) => {
        try {
            if (input.length >= 2) {
                const response = await fetch(`${apiUrl}/api/wt/search?name=${input}`, {
                    method: 'GET',
                    next: {
                        revalidate: 1
                    }
                })

            if (response.ok) {
                const data = await response.json()
                console.log(data)
            }
            }
            

        } catch (err) {
            console.error(err)
        }
    }, [])
    //useMemo for result of function, useCallback for functions 
    /* const debouncedSearch = useMemo(() => debounce(search, 3000), [debounce, search]); */

    const debouncedSearch = useCallback(debounce(search, 3000), [search])

    const handleInputChange = (value) => {
        setQuery(value)
        debouncedSearch(value)
    }



    return (
        <Popover placement="bottom-end">
            <PopoverTrigger>
                <Button isIconOnly aria-label="Open search dropdown">
                    <FaSearch></FaSearch>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                
                <Input
                label="Search"
                size="sm"
                aria-label="Search input"
                value={query}
                onValueChange={handleInputChange}
                >
                </Input>
                
            </PopoverContent>
        
        </Popover>
    )
}