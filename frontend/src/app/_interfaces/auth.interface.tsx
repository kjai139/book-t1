import { ReactNode } from "react";
import User from "./user.interface";


export interface AuthContextType {
    user: User | null,
    setUser: React.Dispatch<React.SetStateAction<User | null>>,
    authCheck: () => Promise<void>,
    logUserOut: () => Promise<void>,
    checkLocal: boolean,
    setCheckLocal:React.Dispatch<React.SetStateAction<boolean>
    
}

export interface AuthProviderProps {
    children: ReactNode
}