"use client"
import { SIGN_UP } from '@/constants/Queries';
import { useMutation } from '@apollo/client';
import { Button } from '@nextui-org/button';
import { Input } from "@nextui-org/input";
import { useState } from 'react';
const Page = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [signUp, { loading, error }] = useMutation(SIGN_UP);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            console.error("Passwords do not match");
            return;
        }

        console.log({ username, email, password, confirmPassword });

    }

    const handleReset = () => {
        // setUsername("")
        // setEmail("")
        // setPassword("")
        // setConfirmPassword("")
    }

    return (
        <main className="flex items-center justify-center w-full h-screen bg-indigo-500">
            <form action={""} className='block space-y-5 text-center' onSubmit={handleSubmit}>
                <h2 className="font-serif text-5xl font-bold tracking-widest caption-top">SignUp</h2>
                <Input type="text" size='sm' isClearable label="Name" placeholder='Enter your Name' value={username} onChange={(e) => setUsername(e.target.value)} required />
                <Input type="email" size='sm' isClearable label="Email" placeholder='Enter your Valid Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input type="text" label="Password" size='sm' placeholder='Enter your Valid Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                <Input type="text" label="Confirm Password" size='sm' placeholder='Enter your Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                <Button color='primary' type='submit' onClick={handleReset}>Sign up</Button>
            </form>
        </main>
    )
}

export default Page
