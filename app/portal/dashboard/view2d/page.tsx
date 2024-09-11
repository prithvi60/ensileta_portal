"use client"
import Header from '@/components/Header';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import Sidebar from '@/components/Sidebar/Sidebar';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useState, useEffect } from 'react'

const Page = () => {
    const [files, setFiles] = useState([]);

    const fetchFiles = async () => {
        try {
            const response = await fetch('/api/fetchFiles');
            console.log('Fetching from:');
            if (response.ok) {
                const data = await response.json();
                setFiles(data);
            } else {
                console.error('Failed to fetch files:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching files:', error);
        }
    };

    useEffect(() => {
        fetchFiles(); // Fetch files when the component mounts
    }, []);

    return (
        <DefaultLayout>
            <div className='w-full h-full overflow-auto flex justify-start items-center gap-10 relative flex-col'>
                <h2 className='text-5xl font-semibold tracking-wide uppercase'>DashBoard</h2>
                <p className='text-lg text-center font-medium tracking-normal font-satoshi '>Our home should tell the story of who you are, and be a collection of what you love 🛋️</p>
                <Image src={"/cover/bg-cover.jpg"} width={450} height={450} alt='bg-image' />
                <div>
                    <h3 className='text-2xl'>Files in Folder:</h3>
                    <ul>
                        {files.map(file => (
                            // @ts-ignore
                            <li key={file.id}>{file.name}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </DefaultLayout>
    )
}

export default Page
