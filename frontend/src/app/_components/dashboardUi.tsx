'use client'

import { useEffect, useState } from "react"
import UploadTabs from "../_components/tabs/uploadTab"
import { useAuth } from "../_contexts/authContext"
import { Button } from "@nextui-org/react"
import { checkUserPriv } from "../actions"


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
        console.log('User from dashboardUI', user)
        const getUserPrivs = async (userId:string) => {
            try {
                const userPriv = await checkUserPriv(userId)
                if (userPriv === 'Admin') {
                    setUserRole('Admin')
                } else if (userPriv === 'User') {
                    setUserRole('User')
                }
            } catch (err:any) {
                console.error(err)
                setUserRole('Error')
            }
            
        }
        if (user._id) {
            //not oauth
            getUserPrivs(user._id)

        } else if (!user._id && user.id) {
            getUserPrivs(user.id)
        }
        
    }, [])
    

    return (
        
        <div className="w-full p-2">
        <div>
            <h3 className="font-semibold">Welcome, {user.name}</h3>
            <div>
                {/* {!user.isVerified &&
                <span className="text-danger flex flex-col gap-2">
                    <p>Your account has not been verified yet.</p>
                    <Button onPress={sendVerificationEmail}>Send verification email</Button>

                </span>
                } */}
                <p>Role: {userRole}</p>
            </div>
        </div>
        {
            userRole === 'Admin' ?
            <UploadTabs></UploadTabs> : null
        }
        {
            userRole === 'User' ?
            <div className="text-default-500 mt-4">
                Features coming soon.
            </div>
            : null
        }
        
      
        </div>
        
        
        
        
        
    )
}