import { Divider } from "@nextui-org/react";
import ViewallWt from "../_components/viewAllWt";
import { ThemeSwitcher } from "../_components/themeSwitcher";
import { dbConnect } from "../_utils/db";
import Genre from "../_models/genre";
import ServerError from "../_components/serverError";


export const revalidate = 120

async function getSearchProps() {
    try {
        await dbConnect()
        const allGenres = await Genre.find().sort({name: 1})

        return JSON.parse(JSON.stringify(allGenres))
    } catch (err) {
        console.error(err)
        throw new Error('Error fetching genres')
    }
    

    
}



export default async function Readpg () {
    let allGenres
    try {
        allGenres = await getSearchProps()
    } catch (err) {
        console.error(err)
        return <ServerError></ServerError>
    }
    


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
            <ViewallWt allGenres={allGenres}></ViewallWt>
            

        </div>
        </main>
    )
}