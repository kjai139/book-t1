'use client'
import { useEffect } from "react"
import UploadTabs from "../_components/tabs/uploadTab"
import { useAuth } from "../_contexts/authContext"
import { Button } from "@nextui-org/react"
import apiUrl from "../_utils/apiEndpoint"



export default function Dashboard () {

    const { user } = useAuth()
    
    const sendVerificationEmail = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/user/verify/send` , {
                method: 'POST',
                credentials: 'include'
            })
            if (response.ok) {
                const json = await response.json()
                console.log(json)
            }

        } catch (err) {
            console.log(err)
        }
    }
    

    return (
        <>
        
           { user &&
           <main>
            <div className="p-2">
                <h3>Welcome, {user.name}</h3>
                <div>
                    {!user.isVerified &&
                    <span className="text-danger flex flex-col gap-2">
                        <p>Your account has not been verified yet.</p>
                        <Button onPress={sendVerificationEmail}>Send verification email</Button>

                    </span>
                    }
                </div>
            </div>
            <UploadTabs></UploadTabs>
            </main>
            }
            
        
        
        
        
        </>
    )
}