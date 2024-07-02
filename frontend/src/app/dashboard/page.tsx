
import { verifySession } from "../_lib/dal"
import DashboardUi from "../_components/dashboardUi"
import { auth } from "@/auth"




export default async function Dashboard () {

    let user:any = await verifySession()
    if (!user) {
        const oauthSession = await auth()
        if (oauthSession) {
            user = oauthSession.user
        }
        
    }
    

    return (
        
            <main>
           { user &&
            <DashboardUi user={user}></DashboardUi>
            }
            </main>
        
        
        
        
        
    )
}