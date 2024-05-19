'use client'

import { useEffect, useState, useRef } from "react";


export const useInView = (rootMargin = '0px') : [boolean, React.RefObject<HTMLDivElement>] => {
    const [isInView, setInView] = useState(false)
    const ref = useRef<HTMLDivElement | null>(null)
    

    useEffect(() => {
        console.log('is in view', isInView)
        const observer = new IntersectionObserver(([entry]) => {
        
            setInView(entry.isIntersecting)
          
            
        }, {
            rootMargin
        })

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [rootMargin])

    return [isInView, ref]
}