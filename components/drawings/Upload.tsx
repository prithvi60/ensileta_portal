"use client"

import { useState } from "react";
import { useSession } from "next-auth/react";
import { uploadFileToS3 } from "@/lib/s3";
import toast from "react-hot-toast";
import { useMutation } from "@apollo/client";
import { UPLOAD_S3_STORAGE } from "@/lib/Queries";


export default function UploadFile({ uploadFile }: { uploadFile: any }) {
    const [file, setFile] = useState<File | null>(null);
    const [size, setSize] = useState<boolean>(false);
    const { data: session } = useSession()
    const [uploadS3] = useMutation(UPLOAD_S3_STORAGE)

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
            alert('File size exceeds 10 MB');
            setSize(true)
            return;
        }

        try {
            // const res = await uploadS3({ variables: { file: file, filename: file.name, userName } })
            // console.log(res);

            const response = await uploadFileToS3(file, file.name, userName)
            const result = await uploadFile({ variables: { fileUrl: response, filename: file.name } })

            console.log('File uploaded successfully:', response);
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
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("Failed to upload file.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className='space-y-5 w-full sm:w-1/2  mx-auto'>
            {/* <div className='block'> */}
            <input type="file" onChange={handleFileChange} className="p-1.5 outline-none shadow-card shadow-green-500 rounded-full cursor-pointer w-full" />
            {size && (
                <p className="text-sm -mt-3.5 text-warning text-center font-bold tracking-wide">File size exceeds 10 MB</p>
            )}
            <button type="submit" className='cursor-pointer w-full p-4 shadow-md select-none bg-secondary text-white hover:bg-[#0E122B]'>Upload File</button>
        </form>
    );
}