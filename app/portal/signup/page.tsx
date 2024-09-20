"use client"

import { SignUp } from '@/components/SignUp';
import { SIGN_UP } from '@/lib/Queries';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
const Page = () => {


    return (
        <main className="flex items-center justify-center w-full h-screen shadow-xl bg-primary">
            <SignUp />
        </main>
    )
}

export default Page
