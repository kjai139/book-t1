'use client'

import { useEffect, useState, useTransition } from "react"
import UploadTabs from "../_components/tabs/uploadTab"
import { useAuth } from "../_contexts/authContext"
import { Button } from "@nextui-org/react"
import { checkUserPriv, checkUserPrivId } from "../actions"
import { useSession } from "next-auth/react"


interface DashboardUiProps {
    user: any,
}

export default function DashboardUi ({user}:DashboardUiProps) {

    const { setUser } = useAuth()
    const [userRole, setUserRole] = useState('')
    const [isPending, startTransition] = useTransition()
    const [ userId, setUserId] = useState('')
    const { update } = useSession()

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
    const getUserPrivs = async (userEmail:string) => {
        try {
            
            const userPriv = await checkUserPriv(userEmail)
            console.log(userPriv)
            if (userPriv.role === 'Admin') {
                setUserRole('Admin')
            } else if (userPriv.role === 'User') {
                setUserRole('User')
                
                
            }
            setUserId(userPriv.userId)
            
        } catch (err:any) {
            console.error(err)
            setUserRole('Error')
        }
        
    }

    const getUserPrivId = async (userId: string) => {
        try {
            const result = await checkUserPrivId(userId)
            if (result.role === 'Admin') {
                setUserRole('Admin')
            } else if (result.role === 'User') {
                setUserRole('User')
                
                
            }
        } catch (err:any) {
            console.error(err)
            setUserRole('Error')
        }
        
    }


    useEffect(() => {
        setUser(user)
        console.log('User from dashboardUI', user)
        
        if (user._id) {
            //not oauth
             
            startTransition(() => {
                getUserPrivId(user._id)
            })
          

        } else if (!user._id && user.email) {
            startTransition(() => {
                getUserPrivs(user.email)
            })
        }
        
    }, [])

    useEffect(() => {
        if (userId && userId !== user.id) {
            update({
                user: {
                    ...user,
                    id: userId
                }
            })
        }
    }, [userId])
    

    return (
        
        <div className="w-full p-2 mw">
        <div>
            <h3 className="font-semibold">Hello, {user.name}</h3>
            <div>
                {/* {!user.isVerified &&
                <span className="text-danger flex flex-col gap-2">
                    <p>Your account has not been verified yet.</p>
                    <Button onPress={sendVerificationEmail}>Send verification email</Button>

                </span>
                } */}
                {/* <p>Role: {userRole}</p> */}
            </div>
        </div>
        {
            !userRole ?
            <div className="mt-4">
                Loading content...
            </div> : null
        }
        {
            userRole === 'Admin' ?
            <UploadTabs></UploadTabs> : null
        }
        {
            userRole === 'User' ?
            <div className="text-default-500 mt-4">
                Features coming soon. For now, you can re-save your bookmarks if you wish to have them linked to your email.
            </div>
            : null
        }
        {
            userRole === 'Error' ?
            <div className="text-default-500 mt-4">
                Encountered an error loading dashboard. Try refreshing and if it doesn't work, please try again later.
            </div> : null
        }
        
      
        </div>
        
        
        
        
        
    )
}