'use client'

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Switch } from "@nextui-org/react"
import { IoSunnySharp, IoMoonSharp } from "react-icons/io5"


export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()
    const [isSelected, setIsSelected] = useState(false)
   

    useEffect(() => {
        setMounted(true)
        const savedUserPref = localStorage.getItem('theme')
        if (savedUserPref) {
           if (savedUserPref === 'lTheme') {
            setIsSelected(true)
            setTheme('lTheme')
           }
        }
    }, [])

   

    


    if (!mounted) return null

    const toggleTheme = () => {
        if (isSelected) {
            setTheme('dTheme')
            setIsSelected(false)
        } else {
            setTheme('lTheme')
            setIsSelected(true)
        }
    }
  


    return (
        <>
            <Switch isSelected={isSelected} onValueChange={toggleTheme} size="md" endContent={<IoSunnySharp></IoSunnySharp>} startContent={<IoMoonSharp></IoMoonSharp>}></Switch>
          
        </>
    )
}