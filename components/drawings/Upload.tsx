"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Loader2 from "../Loader2";

export default function UploadFile({
    uploadFile,
    setIsOpen,
    userId,
    email,
    fileType,
    refetchUsers,
}: {
    uploadFile: any;
    setIsOpen: any;
    userId: number;
    email: string;
    fileType: string;
    refetchUsers: any;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [size, setSize] = useState<boolean>(false);
    const [loadingButton, setLoadingButton] = useState<boolean>(false);
    const { data: session } = useSession();
    // console.log({ email, fileType });
    const userName = session?.user?.name || "anonymous";
    // const email = session?.user?.email

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0] || null;
        setFile(uploadedFile);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        if (file && file.size > 10 * 1024 * 1024) {
            // 10 MB in bytes
            toast.error("File size exceeds 10 MB", {
                position: "top-right",
                duration: 3000,
                style: {
                    border: "1px solid #EB1C23",
                    padding: "16px",
                    color: "#EB1C23",
                },
                iconTheme: {
                    primary: "#EB1C23",
                    secondary: "#FFFAEE",
                },
            });
            setSize(true);
            return;
        }

        try {
            setLoadingButton(true);
            const formData = new FormData();
            formData.append("file", file);
            formData.append("filename", file.name);
            formData.append("userName", userName);

            const response = await fetch("/api/uploadS3", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            const fileUrl = data.fileUrl;

            const result = await uploadFile({
                variables: { fileUrl, filename: file.name, userId },
            });
            console.log(result);

            //         const res = await fetch("/api/sendMail", {
            //             method: "POST",
            //             headers: {
            //                 "Content-Type": "application/json",
            //             },
            //             body: JSON.stringify({
            //                 recipientEmail: `${email}`,
            //                 recipientType: "admin",
            //                 subject3:
            //                     fileType === "view2d"
            //                         ? `ENSILETA INTERIORS -                            New version - 2D Drawing`
            //                         : fileType === "view3d"
            //                             ? `ENSILETA INTERIORS -                            New version - 3D Drawing`
            //                             : fileType === "viewboq"
            //                                 ? `ENSILETA INTERIORS -                            New version - BOQ Drawing`
            //                                 : fileType === "moodBoard"
            //                                     ? `ENSILETA INTERIORS -                            New version - Mood Board Drawing`
            //                                     : fileType === "approvalBoard"
            //                                         ? `ENSILETA INTERIORS -                            New version - Approval Board Drawing`
            //                                         : `ENSILETA INTERIORS -                            New version - Unknown Filetype Drawing`,
            //                 message3: `<p>
            //     We have updated the new version of ${fileType === "view2d"
            //                         ? "2D Drawing"
            //                         : fileType === "view3d"
            //                             ? "3D Drawing"
            //                             : fileType === "viewboq"
            //                                 ? "BOQ Drawing"
            //                                 : fileType === "moodBoard"
            //                                     ? "Mood Board Drawing"
            //                                     : fileType === "approvalBoard"
            //                                         ? "Approval Board Drawing"
            //                                         : "Unknown File Type"
            //                     }, based on your inputs. Please review it and add your valuable remarks
            //   </p>`,
            //             }),
            //         });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Error: Error: please reload and try again`);
            }


            // const result2 = await res.json();
            // console.log("uploading....");

            if (response && result) {
                toast.success("successfully Uploaded", {
                    position: "top-right",
                    duration: 3000,
                    style: {
                        border: "1px solid #65a34e",
                        padding: "16px",
                        color: "#65a34e",
                    },
                    iconTheme: {
                        primary: "#65a34e",
                        secondary: "#FFFAEE",
                    },
                });
                // fetch from db
                refetchUsers();
                setIsOpen(false);
            }
        } catch (error: any) {
            console.error("Error uploading file:", error);
            toast.error(error.message, {
                position: "top-right",
                duration: 3000,
                style: {
                    border: "1px solid #EB1C23",
                    padding: "16px",
                    color: "#EB1C23",
                },
                iconTheme: {
                    primary: "#EB1C23",
                    secondary: "#FFFAEE",
                },
            });
        } finally {
            setLoadingButton(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 w-full sm:w-1/2  mx-auto"
        >
            {/* <div className='block'> */}
            <input
                type="file"
                onChange={handleFileChange}
                className="p-1.5 outline-none shadow-card shadow-secondary rounded-full cursor-pointer w-full"
            />
            {size && (
                <p className="text-sm -mt-3.5 text-warning text-center font-bold tracking-wide">
                    File size exceeds 10 MB
                </p>
            )}
            <button
                disabled={file === null ? true : false}
                type="submit"
                className="cursor-pointer w-full p-4 shadow-md select-none bg-secondary text-white hover:bg-[#0E122B] disabled:bg-opacity-60 disabled:cursor-not-allowed mx-auto transition-all duration-300 ease-in-out"
            >
                {!loadingButton ? "Upload File" : <Loader2 />}
            </button>
        </form>
    );
}
