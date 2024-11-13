
import { verifySession } from "../_lib/dal"
import DashboardUi from "../_components/dashboardUi"
import { auth } from "@/auth"




export default async function Dashboard () {

    let user:any = await verifySession()
    
    

    return (
        
            <main>
          
            <DashboardUi user={user}></DashboardUi>
            
            </main>
        
        
        
        
        
    )
}