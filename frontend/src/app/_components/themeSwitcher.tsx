'use client'

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Switch } from "@nextui-org/react"
import { IoSunnySharp, IoMoonSharp } from "react-icons/io5"


export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()
    
   

    useEffect(() => {
        setMounted(true)
        const savedUserPref = localStorage.getItem('theme')
        if (savedUserPref) {
           if (savedUserPref === 'lTheme') {
            
            setTheme('lTheme')
           }
        }
    }, [])

   

    


    if (!mounted) return null

    const toggleTheme = () => {
        if (theme === 'lTheme') {
            setTheme('dTheme')
           
        } else {
            setTheme('lTheme')
            
        }
    }
  


    return (
        <>
            <Switch aria-label="Light mode Dark mode Toggle" isSelected={theme === 'lTheme'} onValueChange={toggleTheme} size="md" endContent={<IoSunnySharp></IoSunnySharp>} startContent={<IoMoonSharp></IoMoonSharp>}></Switch>
          
        </>
    )
}