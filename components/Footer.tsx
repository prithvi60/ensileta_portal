"use client"
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'
import { MarqueeSb } from './Header/MarqueeUpdated';

const Footer = () => {
    const { data: session } = useSession();
    const role = session?.user?.role;
    const [isFooterSticky, setIsFooterSticky] = useState(false);

    const updateFooterPosition = () => {
        const viewportHeight = window.innerHeight;
        const contentHeight = document.documentElement.scrollHeight;
        const scrollPosition = window.scrollY + viewportHeight;

        // Check if the content is taller than the viewport and not scrolled to the bottom
        if (contentHeight > viewportHeight && scrollPosition < contentHeight) {
            setIsFooterSticky(true);
        } else {
            setIsFooterSticky(false);
        }
    };

    useEffect(() => {
        // Check footer position initially
        updateFooterPosition();

        // Attach scroll and resize listeners
        window.addEventListener("scroll", updateFooterPosition);
        window.addEventListener("resize", updateFooterPosition);

        // Cleanup listeners on component unmount
        return () => {
            window.removeEventListener("scroll", updateFooterPosition);
            window.removeEventListener("resize", updateFooterPosition);
        };
    }, []);
    return (
        <>
            {role !== "super admin" && (
                <footer className={`${isFooterSticky ? 'sticky bottom-0 left-0' : ''} p-2 flex flex-col md:flex-row items-center w-full gap-8 space-y-2 bg-white shadow-lg z-[999]`}>
                    <h4 className="text-lg md:text-xl xl:text-2xl capitalize font-semibold tracking-wider text-black" >Our Partners</h4>
                    <div className='sm:max-w-48 md:max-w-72 2xl:max-w-5xl xl:max-w-3xl w-full'>
                        <MarqueeSb />
                    </div>
                </footer>
            )}
        </>
    )
}

export default Footer
