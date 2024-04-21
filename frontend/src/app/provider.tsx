'use client'

import { NextUIProvider } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { AuthProvider } from "./_contexts/authContext"

export function Providers({children}: { children: React.ReactNode}) {
    const router = useRouter()
    return (
        <NextUIProvider navigate={router.push}>
            <NextThemesProvider attribute="class" defaultTheme="dTheme" themes={['dTheme','lTheme']}>
                <AuthProvider>
                {children}
                </AuthProvider>
            </NextThemesProvider>
        </NextUIProvider>
    )
}