"use client"
import { SignIn } from '@/components/SignIn'
import { div, main } from 'framer-motion/client'
import React from 'react'

const page = () => {
    return (
        <main className='flex justify-center items-center h-screen w-full bg-[#0E132A]'>
            <SignIn />
        </main>
    )
}

export default page
