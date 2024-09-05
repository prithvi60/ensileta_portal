// "use client"
import Header from '@/components/Header';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import Sidebar from '@/components/Sidebar';
import { signOut } from 'next-auth/react';
import { useState } from 'react'

const Page = () => {

    return (
        <DefaultLayout>
            <div className='w-full h-full overflow-auto flex justify-start items-center gap-10 relative flex-col'>
                <h2 className='text-5xl font-semibold tracking-wide uppercase'>DashBoard</h2>
                <p className='text-lg font-medium tracking-normal font-satoshi '>Our home should tell the story of who you are, and be a collection of what you love 🛋️</p>
            </div>
        </DefaultLayout>
    )
}

export default Page
