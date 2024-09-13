'use client'
import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure, Link, Divider } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import NextImage from "next/image";
import { MdDelete } from "react-icons/md";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/_contexts/authContext";
import { randomHash } from "@/app/_utils/version";

export default function BookmarkBtn () {
    const { setCheckLocal } = useAuth()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [bookmarks, setBookmarks] = useState<any[]>([])
    const pathname = usePathname()
    const hashlessPathname = pathname.split(randomHash)[0]

    useEffect(() => {
        if (isOpen) {
            const storedBm = localStorage.getItem('bookmarks')
            if (storedBm) {
                const parsedBm = JSON.parse(storedBm)
                const sortedBm = parsedBm.sort((a:any,b:any) => {
                    if (a.name < b.name) {
                        return -1
                    } else if (a.name > b.name) {
                        return 1
                    } else {
                        return 0
                    }
                })
                setBookmarks(sortedBm)
            } else {
                setBookmarks([])
            }
        } 
        
    }, [isOpen])

    useEffect(() => {
        if (isOpen) {
            onOpenChange()
        }
       
    }, [pathname])

    const removeBm = (key:any) => {
        let storedBookmarks = localStorage.getItem('bookmarks')
        if (storedBookmarks) {
            const parsedBookmarks:any[] = JSON.parse(storedBookmarks)
            const existingBm = parsedBookmarks.findIndex(bm => bm.url === key)

            if (existingBm !== -1) {
                const updatedBm = parsedBookmarks.filter((_:any, index:any) => index !== existingBm)
                localStorage.setItem('bookmarks', JSON.stringify(updatedBm))
                console.log('bm removed:', localStorage)
                setBookmarks(prevArr => prevArr.filter(item => item.url !== key))
                setCheckLocal((prev) => !prev)
            }
        }
        //wip
        
    
        

        
    }

    return (
        <>
        <Button aria-label="Open bookmarks" isIconOnly onClick={onOpen} className="shudder data-[hover=true]:opacity-100">
            <FaBookmark></FaBookmark>
        </Button>
        <Modal disableAnimation isOpen={isOpen} onOpenChange={onOpenChange} classNames={{
            body: 'px-2 sm:px-6'
        }}>
            <ModalContent>
                
                {(onClose) => (
                    <>
                    <ModalHeader className="flex-col">
                        <span>
                        Saved Bookmarks - {bookmarks.length} / 25
                        </span>
                        <span className="text-sm text-default-500">Sign in for more.</span>
                    </ModalHeader>
                    <ModalBody>
                        <ul className="max-h-[400px] overflow-y-auto bmark-cont flex flex-col my-4">
                        {bookmarks && bookmarks.length > 0 ? bookmarks.map((node, idx) => {
                            return (
                                <li key={`sr${node.url}-${idx}`} className="flex p-2 justify-center items-center relative flex-col">
                                <Link href={`${node.url}${randomHash}`} isDisabled={node.url === pathname ? true : false} isBlock className="flex w-full">
                                <div className="relative mr-2 h-auto">
                                    <NextImage className="w-[60px] h-auto" width={0} height={0} alt={`Cover of ${node.image}`} src={node.image} unoptimized></NextImage>
                                </div>
                                <div className="flex flex-col flex-2 p-2 gap-1">
                                    <span className="font-semibold text-sm bm-txt">{node.name}</span>
                                    <span className="text-xs text-default-500">Status: {node.status}</span>
                                    <span className="text-xs text-default-500 bm-txt">
                                        {node.genres}
                                    </span>
                                </div>
                                </Link>
                                
                                <Button size="lg" variant="light" color="default" onPress={() => removeBm(node.url)} className="w-full text-sm text-default-500 mt-4" aria-label={`delete bookmark of ${node.name}`} startContent={<MdDelete size={20}></MdDelete>}>Delete this bookmark</Button>
                              
                                <Divider className="mt-2"></Divider>
                                </li>
                                
                            )
                        }): 
                        <li className="m-4">You have nothing bookmarked.</li>
                        }
                        </ul>
                    </ModalBody>

                    </>
                )}

            </ModalContent>
        </Modal>
        </>
    
    )
}