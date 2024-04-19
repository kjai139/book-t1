

import UploadTabs from "../_components/tabs/uploadTab"
import { Button } from "@nextui-org/react"
import { verifySession } from "../_lib/dal"
import DashboardUi from "../_components/dashboardUi"




export default async function Dashboard () {

    const user:any = await verifySession()
    
    

    return (
        
            <main>
           { user &&
            <DashboardUi user={user}></DashboardUi>
            }
            </main>
        
        
        
        
        
    )
}