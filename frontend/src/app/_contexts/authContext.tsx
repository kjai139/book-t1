'use client'


import { createContext, useContext, useState } from "react";
import { AuthContextType, AuthProviderProps } from "../_interfaces/auth.interface";
import User from "../_interfaces/user.interface";
import { usePathname, useRouter } from "next/navigation";

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider ({children}:AuthProviderProps) {

    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState<User | null>(null)
    const [checkLocal, setCheckLocal] = useState(false)
    //migrated to server action
    const authCheck = async () => {
        

        
            
            try {
                const response = await fetch(`/api/auth/check`, {
                    method: 'GET',
                    credentials: 'include',
                    cache: 'no-cache',
                    
    
                })
    
                if (response.ok) {
                    const responseData = await response.json()
                    setUser(responseData.user)
                    console.log('User is logged in.', responseData)
                    if (pathname === '/login') {
                        router.push('/dashboard')
                    }
                  
                    
                } else {
                    if (pathname === '/dashboard') {
                        router.push('/login')
                    }
                   
                    const responseData = await response.json()
                    console.log('User is not logged in.', responseData)
                    
                }
    
            } catch (err) {
                console.error(err)
            }
        
        
    }
    //migrated to server action
    const logUserOut = async () => {
        try {
            const response = await fetch(`/api/user/logout`, {
                method: 'POST',
                credentials: 'include',
                cache: 'no-cache'
            })

            if (response.ok) {
                setUser(null)
                console.log('User logged out successfully')
            }

        } catch (err) {
            console.error(err)
        }
    }





    return (
        <AuthContext.Provider value={{user, setUser, authCheck, logUserOut, checkLocal, setCheckLocal}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}