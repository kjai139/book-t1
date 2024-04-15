import apiUrl from "@/app/_utils/apiEndpoint";
import { Button, Input, Link, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useCallback, useState } from "react";
import { FaSearch } from "react-icons/fa";
import NextImage from "next/image";




export default function PbNavSearch () {

    const [query, setQuery] = useState('')
    const [result, setResult] = useState<any>()
    const [noResult, setNoResult] = useState<any>(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    
    
    const debounce = useCallback((callback:any, delay:number) => {
        let timeoutId:any
    
        return (...args:any) => {
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
                    /* console.log(data) */
                    setResult(data.results)
                    if (data.results.length === 0) {
                        setNoResult(true)
                    } else {
                        setNoResult(false)
                    }
                } else {
                    setResult(null)
                    setNoResult(true)
                }
            }
            

        } catch (err) {
            console.error(err)
            setResult(null)
        }
    }, [])
    //useMemo for result of function, useCallback for functions 
    /* const debouncedSearch = useMemo(() => debounce(search, 3000), [debounce, search]); */

    const debouncedSearch = useCallback(debounce(search, 1500), [search])

    const handleInputChange = useCallback((value:any) => {
        setQuery(value)
        debouncedSearch(value)
    }, [])

    const onOpenChange = useCallback(() => {
        setResult(null)
        setQuery('')
        setNoResult(false)
        setIsSearchOpen((prev)=> !prev)
        
    }, [])



    return (
        <Popover className="relative p-2" isOpen={isSearchOpen} onOpenChange={onOpenChange}>
            <PopoverTrigger>
            <Button isIconOnly>
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
                className="w-full p-1"
                isClearable
                
                >
                </Input>
                
                {result &&
                <ul className="flex flex-col max-h-[400px] overflow-auto">
                    {result.map((node:any) => {
                        const genres = node.genres.map((node:any) => node.name).join(', ')

                        return (
                            <li key={`sr${node._id}`} className="flex p-2 justify-center items-center">
                            <Link href={`/read/${node.slug}`} onPress={onOpenChange} className="w-full">
                            <div className="relative w-[50px] h-[75px]">
                                <NextImage fill alt={`Cover of ${node.image}`} src={node.image} sizes="(max-width:600px) 15vw 5vw" style={{
                                    objectFit:'cover'
                                }}></NextImage>
                            </div>
                            <div className="flex flex-col flex-1 p-2">
                                <span className="font-semibold text-xs">{node.name}</span>
                                <span className="text-xs text-default-500">Status: {node.status}</span>
                                <span className="text-xs text-default-500 search-txt">
                                    {genres}
                                </span>
                            </div>
                            </Link>
                        </li>
                        )
                    })}

                        
                </ul>
                }
                {
                    noResult &&
                <ul>
                    <li className="p-2">
                        <span>
                            No matching results.
                        </span>
                    </li>
                </ul>
                }
            </PopoverContent>
        </Popover>
                
                
                
                
                
    
    )
}