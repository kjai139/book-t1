'use client'

import { NextUIProvider } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { AuthProvider } from "./_contexts/authContext"
import SessionWrapper from "./_contexts/sessionProvider"

export function Providers({children}: { children: React.ReactNode}) {
    const router = useRouter()
    return (
        <NextUIProvider navigate={router.push}>
            <SessionWrapper>
            <NextThemesProvider attribute="class" defaultTheme="dTheme" themes={['dTheme','lTheme']}>
                <AuthProvider>
                {children}
                </AuthProvider>
            </NextThemesProvider>
            </SessionWrapper>
        </NextUIProvider>
    )
}