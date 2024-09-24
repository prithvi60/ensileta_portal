import React from 'react'
import { Marquee } from './Header/Marquee'
import Image from 'next/image'

const Footer = () => {
    return (
        <footer className="sticky bottom-0 z-[1000] flex flex-col justify-center  w-full bg-white drop-shadow-1 sm:hidden px-4 py-4 items-center shadow-2 md:px-6 2xl:px-11">
            <div className="w-64 h-8 relative">
                <Image alt="logo" src={"/logo/newlogo.png"} fill />
            </div>
            <Marquee />
        </footer>
    )
}

export default Footer
