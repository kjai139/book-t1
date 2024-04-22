
import { Button, Input, Link, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { useCallback, useEffect, useState, useMemo } from "react";
import { FaSearch } from "react-icons/fa";
import NextImage from "next/image";
import { usePathname } from "next/navigation";




export default function PbNavSearch () {

    const [query, setQuery] = useState('')
    const [result, setResult] = useState<any>()
    const [noResult, setNoResult] = useState<any>(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [resultError, setResultError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname()

    console.log('RE RENDER SEARCHBAR')


    const search = useCallback(async (input:string) => {
        try {
            if (input.length >= 2) {
                setIsLoading(true)
                const response = await fetch(`/api/wt/search?name=${input}`, {
                    method: 'GET',
                    next: {
                        revalidate: 60 * 60,
                        tags: ['updateContent']
                    }
                })

                if (response.ok) {
                    const data = await response.json()
                    /* console.log(data) */
                    setResult(data.results)
                    if (data.results.length === 0) {
                        setIsLoading(false)
                        setNoResult(true)
                    } else {
                        setNoResult(false)
                        setIsLoading(false)
                    }
                } else {
                    setIsLoading(false)
                    setResult(null)
                    setNoResult(true)
                    
                }
            }
            

        } catch (err) {
            console.error(err)
            setIsLoading(false)
            setResult(null)
            setResultError(true)
        }
    }, [])

    const debounce = (callback:any, delay:number) => {
        let timeoutId:any
    
        return (...args:any) => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => callback(...args), delay)
        }
    }
 

    const debouncedSearch = useMemo(() => {
        return debounce(search, 1500)
    }, [])

    const handleInputChange = (value:any) => {
        setQuery(value)
        debouncedSearch(value)
    }

    const onOpenChange = () => {
        setResult(null)
        setQuery('')
        setNoResult(false)
        setIsSearchOpen((prev)=> !prev)
    }

   

    useEffect(() => {
        setResult(null)
        setQuery('')
        setNoResult(false)
        setIsSearchOpen(false)
    }, [pathname])



    return (
        <Popover className="relative p-2" isOpen={isSearchOpen} onOpenChange={onOpenChange} radius="sm">
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
                radius="sm"
                onValueChange={handleInputChange}
                className="w-full p-1"
                isClearable
                
                >
                </Input>
                
                {result &&
                <ul className="flex flex-col max-h-[400px] overflow-auto search-cont">
                    {result.map((node:any) => {
                        const genres = node.genres.map((node:any) => node.name).join(', ')

                        return (
                            <li key={`sr${node._id}`} className="flex p-2 justify-center items-center">
                            <Link href={`/read/${node.slug}`} className="w-full flex-1" isBlock isDisabled={pathname === `/read/${node.slug}`}>
                            <div className="relative w-[50px] h-[75px]">
                                <NextImage fill alt={`Cover of ${node.image}`} src={node.image} sizes="(max-width:400px) 10vw, (max-width:1200) 5vw, 5vw" style={{
                                    objectFit:'cover'
                                }}></NextImage>
                            </div>
                            <div className="flex flex-col flex-1 p-2">
                                <span className="font-semibold text-xs mb-1">{node.name}</span>
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
                {
                    noResult && resultError &&
                <ul>
                    <li className="p-2">
                        <span>
                            Error getting results.
                        </span>
                    </li>
                </ul>
                }
                {
                    !result && !resultError && isLoading &&
                <ul>
                    <li className="p-2">
                        <span>
                            Searching...
                        </span>
                    </li>
                </ul>
                }
            </PopoverContent>
        </Popover>
                
                
                
                
                
    
    )
}