"use client"
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { MarqueeSb } from './Header/MarqueeUpdated';
import Image from 'next/image';

const Footer = () => {
    const { data: session } = useSession();
    const role = session?.user?.role;
    const [isFooterSticky, setIsFooterSticky] = useState(false);

    const updateFooterPosition = () => {
        const viewportHeight = window.innerHeight;
        const contentHeight = document.documentElement.scrollHeight;
        const scrollPosition = window.scrollY + viewportHeight;

        if (contentHeight > viewportHeight && scrollPosition < contentHeight) {
            setIsFooterSticky(true);
        } else {
            setIsFooterSticky(false);
        }
    };

    useEffect(() => {
        updateFooterPosition();

        window.addEventListener("scroll", updateFooterPosition);
        window.addEventListener("resize", updateFooterPosition);

        return () => {
            window.removeEventListener("scroll", updateFooterPosition);
            window.removeEventListener("resize", updateFooterPosition);
        };
    }, []);
    return (
        <>
            {role !== "super admin" && role !== "contact admin" &&
                role !== "design admin" && (
                    <footer className={`${isFooterSticky ? 'sticky bottom-0 left-0' : ''} p-2 flex flex-col  md:flex-row items-center w-full gap-3 md:gap-8 space-y-2 bg-white shadow-lg z-[999]`}>
                        <h4 className="hidden md:block text-secondary text-lg md:text-lg xl:text-xl capitalize font-semibold tracking-wider pl-3" >Our Partners</h4>
                        <div className="block md:hidden w-64 h-8 relative">
                            <Image alt="logo" src={"/logo/newlogo.png"} fill />
                        </div>
                        <div className='sm:max-w-5xl md:max-w-72 2xl:max-w-5xl xl:max-w-3xl w-full'>
                            <MarqueeSb />
                        </div>
                    </footer>
                )}
        </>
    )
}

export default Footer
