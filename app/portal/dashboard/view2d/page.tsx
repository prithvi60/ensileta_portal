"use client";
import DefaultLayout from '@/components/Layout/DefaultLayout';
import { SwipeCarousel } from '@/components/SwiperCarousal';
import Image from 'next/image';
import { useEffect, useState } from 'react'


interface GetAll2DViewResponse {
    getAll2DFiles: Array<{
        id: number;
        fileName: string;
        fileURL: string;
        version: number;
        createdAt: string;
    }>;
}

const Page = () => {
    const [files, setFiles] = useState([]);

    const fetchFiles = async () => {
        try {
            const response = await fetch('/api/fetchFiles');
            // console.log('Fetching from:');
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
            {/* <section className='h-[500px] w-full space-y-10'>
                {RoleBased?.user?.role === "super admin" ? (
                    <InputForm handleChange={handleChange} handleSubmit={handleSubmit} inputValue={inputValue} />
                ) : (
                    <div className='w-full h-auto flex justify-center items-center'>
                        <button type="submit" className='cursor-pointer p-1.5 shadow-md select-none bg-[#139F9B] text-white rounded-md'>Approval</button>
                    </div>
                )}

                <GetAll2dView loading={loading} error={error} data={data?.getAll2DFiles} />
            </section> */}
            <div className='w-full h-full relative flex flex-col gap-10 '>
                {/* <h2 className='text-5xl font-semibold tracking-wide uppercase'>DashBoard</h2>
                <p className='text-lg text-center font-medium tracking-normal font-satoshi '>Our home should tell the story of who you are, and be a collection of what you love 🛋️</p>
                <Image src={"/cover/bg-cover.jpg"} width={450} height={450} alt='bg-image' /> */}
                <div>
                    <h3 className='text-2xl'>Files in Folder:</h3>
                    <ul>
                        {files.map(file => {
                            console.log("file", file);
                            // @ts-ignore
                            return <li key={file.id}>{file.name}</li>
                        })}
                    </ul>
                </div>
                {/* Add the SwipeCarousel component here */}
                {/* @ts-ignore */}
                <SwipeCarousel pdf={files.length > 0 ? files[0].webContentLink : ""} />
            </div>
        </DefaultLayout>
    );
};

export default Page;
