import { Divider } from "@nextui-org/react";
import ViewallWt from "../_components/viewAllWt";



export default function Readpg () {


    return (
        <main>
        <div className="flex flex-col max-w-[1024px] w-full">
            <div className="p-4">
                <h3>All Webtoons</h3>
                <Divider className="mt-2"></Divider>
            </div>
            <ViewallWt></ViewallWt>
            

        </div>
        </main>
    )
}