'use client'
import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FaBookmark } from "react-icons/fa";
import NextImage from "next/image";
import { MdDelete } from "react-icons/md";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/_contexts/authContext";

export default function BookmarkBtn () {
    const { setCheckLocal } = useAuth()
    const { isOpen, onOpen, onOpenChange } = useDisclosure()
    const [bookmarks, setBookmarks] = useState([])
    const pathname = usePathname()

    useEffect(() => {
        const storedBm = localStorage.getItem('bookmarks')
        if (storedBm) {
            const parsedBm = JSON.parse(storedBm)
            setBookmarks(parsedBm)
        } else {
            setBookmarks([])
        }
    }, [onOpenChange])

    const removeBm = (key) => {
        let storedBookmarks = localStorage.getItem('bookmarks')
        if (storedBookmarks) {
            const parsedBookmarks = JSON.parse(storedBookmarks)
            const existingBm = parsedBookmarks.findIndex(bm => bm.url === key)

            if (existingBm !== -1) {
                const updatedBm = parsedBookmarks.filter((_, index) => index !== existingBm)
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
        <Button aria-label="Open bookmarks" isIconOnly onPress={onOpen}>
            <FaBookmark></FaBookmark>
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            {/* modalcontent takes a function as children and takes onclose */}
            <ModalContent>
                
                {(onClose) => (
                    <>
                    <ModalHeader>
                        Saved Bookmarks
                    </ModalHeader>
                    <ModalBody>
                        <ul className="max-h-[400px] overflow-y-auto bmark-cont">
                        {bookmarks && bookmarks.length > 0 ? bookmarks.map((node, idx) => {
                            return (
                                <li key={`sr${node.url}-${idx}`} className="flex p-2 justify-center items-center">
                                <Link href={node.url} isDisabled={node.url === pathname ? true : false}>
                                <div className="relative aspect-4/3 w-full flex-1">
                                    <NextImage fill alt={`Cover of ${node.image}`} src={node.image} sizes="(max-width:600px) 15vw 10vw"></NextImage>
                                </div>
                                <div className="flex flex-col flex-2 p-2">
                                    <span className="font-semibold text-sm">{node.name}</span>
                                    <span className="text-xs text-default-500">Status: {node.status}</span>
                                    <span className="text-xs text-default-500 whitespace-normal">
                                        {node.genres}
                                    </span>
                                </div>
                                </Link>
                                <Button isIconOnly size="lg" variant="light" color="default" onPress={() => removeBm(node.url)}><MdDelete></MdDelete></Button>
                                </li>
                            )
                        }): 
                        <li>You have nothing bookmarked.</li>
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