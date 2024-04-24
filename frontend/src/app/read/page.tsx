import { Divider } from "@nextui-org/react";
import ViewallWt from "../_components/viewAllWt";
import { ThemeSwitcher } from "../_components/themeSwitcher";



export default function Readpg () {


    return (
        <main>
        <div className="flex flex-col max-w-[1024px] w-full">
            <div className="p-4">
                <div className="flex justify-between items-center">
                <h3>All Webtoons</h3>
                <div className="sm:hidden">
                <ThemeSwitcher></ThemeSwitcher>
                </div>
                </div>
                <Divider className="mt-2"></Divider>
            </div>
            <ViewallWt></ViewallWt>
            

        </div>
        </main>
    )
}