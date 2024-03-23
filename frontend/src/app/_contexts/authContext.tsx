'use client'


import { createContext, useContext, useState } from "react";
import { AuthContextType, AuthProviderProps } from "../_interfaces/auth.interface";
import apiUrl from "../_utils/apiEndpoint";
import User from "../_interfaces/user.interface";

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider ({children}:AuthProviderProps) {

    const [user, setUser] = useState<User | null>(null)
    const authCheck = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/auth/check`, {
                method: 'GET',
                credentials: 'include',
                cache: 'no-cache',
                

            })

            if (response.ok) {
                const responseData = await response.json()
                setUser(responseData.user)
                console.log('User is logged in.', responseData)
            } else {
                const responseData = await response.json()
                console.log('User is not logged in.', responseData)
            }

        } catch (err) {
            console.error(err)
        }
    }

    const logUserOut = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/user/logout`, {
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
        <AuthContext.Provider value={{user, setUser, authCheck, logUserOut}}>
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