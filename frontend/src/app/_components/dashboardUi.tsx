'use client'

import { useEffect, useState } from "react"
import UploadTabs from "../_components/tabs/uploadTab"
import { useAuth } from "../_contexts/authContext"
import { Button } from "@nextui-org/react"


interface DashboardUiProps {
    user: any,
}

export default function DashboardUi ({user}:DashboardUiProps) {

    const { setUser } = useAuth()
    const [userRole, setUserRole] = useState('')

    const sendVerificationEmail = async () => {
        try {
           /*  const response = await fetch(`${apiUrl}/api/user/verify/send` , {
                method: 'POST',
                credentials: 'include'
            })
            if (response.ok) {
                const json = await response.json()
                console.log(json)
            } */
            console.log('feature disabled at the moment.')

        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        setUser(user)
    }, [])
    

    return (
        
        <div>
        <div className="p-2">
            <h3 className="font-semibold">Welcome, {user.name}</h3>
            <div>
                {/* {!user.isVerified &&
                <span className="text-danger flex flex-col gap-2">
                    <p>Your account has not been verified yet.</p>
                    <Button onPress={sendVerificationEmail}>Send verification email</Button>

                </span>
                } */}
            </div>
        </div>
        <UploadTabs></UploadTabs>
      
        </div>
        
        
        
        
        
    )
}