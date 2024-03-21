import { Button, Input, Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";
import { FaBookmark } from "react-icons/fa";

export default function BookmarkBtn () {
    


    return (
        <Popover placement="bottom-end">
            <PopoverTrigger>
                <Button isIconOnly aria-label="Open Bookmark dropdown" color="warning">
                    <FaBookmark></FaBookmark>
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div>
                    Bookmark stuff 
                </div>
                
                
            </PopoverContent>
        
        </Popover>
    )
}