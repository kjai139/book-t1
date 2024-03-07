'use client'

import { useState } from "react"
import { RxHamburgerMenu } from "react-icons/rx"
import MainHeaderModal from "./modals/mainHeaderModal"

export default function MainHeaderNav () {

    

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <nav className="relative flex justify-between p-2 items-center">
            <div>

            </div>
            <div>
                searchbar
            </div>
            <div>
                <button onClick={() => setIsMenuOpen(prev => !prev)}>
                    <RxHamburgerMenu size={48}></RxHamburgerMenu>
                </button>
            </div>
            {
                isMenuOpen &&
                <MainHeaderModal></MainHeaderModal>
            }

        </nav>
    )
}