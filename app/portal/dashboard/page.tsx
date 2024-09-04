"use client"
import { signOut } from 'next-auth/react';
import React from 'react'

const page = () => {

    const handleLogout = () => {
        signOut({ redirect: true, callbackUrl: "/api/auth/signin" });
    }
    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <h2 className='text-5xl'>Dashboard</h2>
            <button className='bg-[#139F9B] hover:bg-opacity-75 text-lg text-white rounded-md px-3.5 py-2 absolute top-5 right-10' onClick={handleLogout}>Logout</button>
        </div>
    )
}

export default page
