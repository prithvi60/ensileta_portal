"use client"

import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";


export default function UploadFile({ uploadFile, setIsOpen, userId }: { uploadFile: any, setIsOpen: any, userId: number }) {
    const [file, setFile] = useState<File | null>(null);
    const [size, setSize] = useState<boolean>(false);
    const { data: session } = useSession()

    const userName = session?.user?.name || 'anonymous';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0] || null;
        setFile(uploadedFile);

    };

    // console.log(file);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        if (file && file.size > 10 * 1024 * 1024) { // 10 MB in bytes
            toast.error("File size exceeds 10 MB", {
                position: "top-right",
                duration: 3000,
                style: {
                    border: '1px solid #9d4949',
                    padding: '16px',
                    color: '#9d4949',
                },
                iconTheme: {
                    primary: '#9d4949',
                    secondary: '#FFFAEE',
                },
            });
            setSize(true)
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('filename', file.name);
            formData.append('userName', userName);

            const response = await fetch('/api/uploadS3', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload file');
            }

            const data = await response.json();
            const fileUrl = data.fileUrl;
            const result = await uploadFile({ variables: { fileUrl, filename: file.name, userId } })

            // console.log('File uploaded successfully:', response);
            // call query for new files
            if (response && result) {
                toast.success('successfully Created', {
                    position: "top-right",
                    duration: 3000,
                    style: {
                        border: '1px solid #63b6b3',
                        padding: '16px',
                        color: '#63b6b3',
                    },
                    iconTheme: {
                        primary: '#63b6b3',
                        secondary: '#FFFAEE',
                    },
                })
                setIsOpen(false)
            }
        } catch (error: any) {
            console.error("Error uploading file:", error);
            toast.error(error.message, {
                position: "top-right",
                duration: 3000,
                style: {
                    border: '1px solid #9d4949',
                    padding: '16px',
                    color: '#9d4949',
                },
                iconTheme: {
                    primary: '#9d4949',
                    secondary: '#FFFAEE',
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-5 w-full sm:w-1/2  mx-auto'>
            {/* <div className='block'> */}
            <input type="file" onChange={handleFileChange} className="p-1.5 outline-none shadow-card shadow-secondary rounded-full cursor-pointer w-full"
            />
            {size && (
                <p className="text-sm -mt-3.5 text-warning text-center font-bold tracking-wide">File size exceeds 10 MB</p>
            )}
            <button type="submit" className='cursor-pointer w-full p-4 shadow-md select-none bg-secondary text-white hover:bg-[#0E122B]'>Upload File</button>
        </form>
    );
}