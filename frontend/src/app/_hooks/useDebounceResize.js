'use client'
import { useEffect } from 'react'
import debounce from '../_utils/debounce'

function useDebounceResize(callback, delay=300) {
    useEffect(() => {
        const debouncedCallback = debounce(callback, delay)
        window.addEventListener('resize', debouncedCallback)

        return () => {
            window.removeEventListener('resize', debouncedCallback)
        }
    }, [callback, delay])
}

export default useDebounceResize