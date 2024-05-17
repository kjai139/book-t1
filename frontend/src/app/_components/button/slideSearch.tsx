import { Input, Link, Spinner } from "@nextui-org/react"
import { useCallback, useState, useMemo, useRef, useEffect } from "react"
import NextImage from "next/image"
import { usePathname } from "next/navigation"

interface SlideSearchBarProps {
    isSearchOpen: boolean,
    setIsSearchOpen: (isSearchOpen:boolean) => void
}



export default function SlideSearchBar ({isSearchOpen, setIsSearchOpen}:SlideSearchBarProps) {

    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<any>()
    const [noResult, setNoResult] = useState(false)
    const [resultError, setResultError] = useState(false)
    const [query, setQuery] = useState('')
    const searchInputRef = useRef<any>(null)
    const pathname = usePathname()

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
                    console.log(data)
                    setResult(data.results)
                    if (data.results.length === 0) {
                        setIsLoading(false)
                        setNoResult(true)
                    } else {
                        setNoResult(false)
                        setIsLoading(false)
                    }
                } else {
                    const data = await response.json()
                    console.log(data)
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

    useEffect(() => {
        const handleScroll = () => {
            if (isSearchOpen) {
                setIsSearchOpen(false)
            }
        }
        if (isSearchOpen && searchInputRef.current) {
            const timeoutId = setTimeout(() => {
                searchInputRef.current.focus()
                window.addEventListener('scroll', handleScroll)
            }, 300)

            return () => {
                clearTimeout(timeoutId)
                window.removeEventListener('scroll', handleScroll)
            }
            
        }
        

        
    }, [isSearchOpen])

    useEffect(() => {
        if (!isSearchOpen) {
            setResult(null)
            setQuery('')
            setNoResult(false)
        }
    }, [isSearchOpen])

    useEffect(() => {
        setResult(null)
        setQuery('')
        setNoResult(false)
        setIsSearchOpen(false)
    }, [pathname])


    return (
        <div className={`max-w-[1024px] lg:max-w-[750px] w-full items-center flex justify-center nav-sb ${isSearchOpen ? 'active' : 'inactive'} lg:mt-8 lg:mb-4`}>
            <div className="w-full">
        <Input size="lg" placeholder="Enter a title..." value={query} onValueChange={handleInputChange} maxLength={40} isClearable aria-label="Search input" radius="none" ref={searchInputRef} endContent={isLoading && <Spinner></Spinner>} autoComplete="off" classNames={{
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "bg-content3",
            "group-data-[hover=true]:bg-content3",
            "group-data-[focus=true]:bg-content3",
            "border-1 border-content3"
          ]
        }}></Input>
        {result &&
                <ul className="flex flex-col max-h-[400px] overflow-auto search-cont absolute w-full bg-content3 mt-2">
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
                <ul className="flex flex-col max-h-[400px] overflow-auto search-cont absolute w-full bg-content3 mt-2">
                    <li className="p-4">
                        
                            No matching results.
                       
                    </li>
                </ul>
                }
                {
                    noResult && resultError &&
                <ul className="flex flex-col max-h-[400px] overflow-auto search-cont absolute w-full bg-content3 mt-2">
                    <li className="p-2">
                        <span>
                            Error getting results.
                        </span>
                    </li>
                </ul>
                }
                
                </div>
      </div>
    )
}