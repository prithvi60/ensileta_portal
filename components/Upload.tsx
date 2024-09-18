"use client"

import { useState } from "react";
import { useSession } from "next-auth/react";
import { uploadFileToS3 } from "@/lib/s3";
import { useMutation } from "@apollo/client";
import { UPLOAD_FILE_MUTATION } from "@/lib/Queries";
import toast from "react-hot-toast";

// const s3Client = new S3Client({
//     region: process.env.NEXT_PUBLIC_AWS_REGION,
//     credentials: {
//         accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
//         secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
//     },
// });

// interface UploadFileProps {
//     setPdfURL: (url: string) => void;
// }

export default function UploadFile() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadFile] = useMutation(UPLOAD_FILE_MUTATION);
    const { data: session } = useSession()

    const userName = session?.user?.name || 'anonymous';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0] || null;
        setFile(uploadedFile);

    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        try {
            const response = await uploadFileToS3(file, file.name, userName)
            const result = await uploadFile({ variables: { fileUrl: response, filename: file.name } })
            // setPdfURL(response)
            // console.log('File uploaded successfully:', response);
            if (response && result) {
                toast.success('successfully Created', {
                    position: "top-right",
                    duration: 3000,
                    style: {
                        border: '1px solid #139F9B',
                        padding: '16px',
                        color: '#139F9B',
                    },
                    iconTheme: {
                        primary: '#139F9B',
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
        <form onSubmit={handleSubmit} className='flex justify-center items-center flex-col gap-5 w-full text-center'>
            {/* <div className='block'> */}
            <input type="file" onChange={handleFileChange} className="p-1.5 outline-none shadow-card shadow-green-500 rounded-full cursor-pointer" />
            <button type="submit" className='cursor-pointer p-3 shadow-md select-none bg-[#139F9B] text-white rounded-md '>Upload File</button>
        </form>
    );
}