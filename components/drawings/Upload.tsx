"use client"

import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";


export default function UploadFile({ uploadFile, setIsOpen, userId, email, fileType }: { uploadFile: any, setIsOpen: any, userId: number, email: string, fileType: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [size, setSize] = useState<boolean>(false);
    const [loadingButton, setLoadingButton] = useState<string>("Upload File");
    const { data: session } = useSession()
    // console.log({ email, fileType });

    const userName = session?.user?.name || 'anonymous';

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0] || null;
        setFile(uploadedFile);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        if (file && file.size > 10 * 1024 * 1024) { // 10 MB in bytes
            toast.error("File size exceeds 10 MB", {
                position: "top-right",
                duration: 3000,
                style: {
                    border: '1px solid #EB1C23',
                    padding: '16px',
                    color: '#EB1C23',
                },
                iconTheme: {
                    primary: '#EB1C23',
                    secondary: '#FFFAEE',
                },
            });
            setSize(true)
            return;
        }

        try {
            setLoadingButton("Uploading...");
            const formData = new FormData();
            formData.append('file', file);
            formData.append('filename', file.name);
            formData.append('userName', userName);

            const response = await fetch('/api/uploadS3', {
                method: 'POST',
                body: formData,
            });

            const res = await fetch('/api/sendMail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipientEmail: `liwoc58139@sgatra.com`,
                    subject: fileType === "view2d" ? '2D Drawing File Upload Notification' :
                        fileType === "view3d" ? '3D Drawing File Upload Notification' : fileType === "viewboq" ? 'BOQ File Upload Notification' : 'Unknown File Type Notification',
                    message: fileType === "view2d" ? '2D Drawing File Upload Successfully' :
                        fileType === "view3d" ? '3D Drawing File Upload Successfully' : fileType === "viewboq" ? 'BOQ File Upload Successfully' : 'Unknown File Type Successfully',
                }),
            });

            if (!response.ok && !res.ok) {
                throw new Error('Failed to upload file');
            }

            const data = await response.json();
            const fileUrl = data.fileUrl;
            console.log("uploading....");

            const result = await uploadFile({ variables: { fileUrl, filename: file.name, userId } })

            // console.log('File uploaded successfully:', response);
            // call query for new files
            if (response && result) {
                toast.success('successfully Created', {
                    position: "top-right",
                    duration: 3000,
                    style: {
                        border: '1px solid #65a34e',
                        padding: '16px',
                        color: '#65a34e',
                    },
                    iconTheme: {
                        primary: '#65a34e',
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
                    border: '1px solid #EB1C23',
                    padding: '16px',
                    color: '#EB1C23',
                },
                iconTheme: {
                    primary: '#EB1C23',
                    secondary: '#FFFAEE',
                },
            });
        } finally {
            setLoadingButton("Upload");
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
            <button disabled={file === null ? true : false} type="submit" className='cursor-pointer w-full p-4 shadow-md select-none bg-secondary text-white hover:bg-[#0E122B] disabled:bg-opacity-60 disabled:cursor-not-allowed'>{loadingButton}</button>
        </form>
    );
}