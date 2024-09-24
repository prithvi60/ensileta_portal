"use client"
import { useSession } from "next-auth/react";
import ModernCarousel from './SwipeCarousal';
import ShuffleSortTable from './Table';
import { GET_USER } from '@/lib/Queries';
import { useQuery } from '@apollo/client';
import toast from "react-hot-toast";


interface FileData {
    id: number;
    filename: string;
    fileUrl: string;
    version: number;
    createdAt: string;
}

interface GetAll2DViewProps {
    data?: Array<FileData>
    // loading: boolean
    // error?: Error;
    uploadFile: any
    title: string
    allUsers: any
    fileType: string
}

export const GetAll2dView: React.FC<GetAll2DViewProps> = ({ data, uploadFile, title, allUsers, fileType }) => {

    const { data: RoleBased } = useQuery(GET_USER);
    const { data: session } = useSession()
    // const superAdmin = allUsers.users.filter((val: any) => val.role === "super admin")
    const filteredData = allUsers.users.filter((val: any) => val.role === "admin")

    const lastItem = data?.[data?.length - 1] || null;
    const handleSendEmail = async () => {
        try {

            const response = await fetch('/api/sendMail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Session info not changing based after update
                body: JSON.stringify({
                    recipientEmail: `${session?.user?.email}`,
                    subject: 'Version Changed',
                    message: 'New Change',
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data) {
                toast.success('Version Updated successfully', {
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
                });
            }

        } catch (error: any) {
            console.error('Error sending email:', error);
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
        <div className='h-full w-full p-10 space-y-5'>
            <h2 className='text-3xl w-full text-center font-semibold caption-bottom tracking-wide mb-10'>{title}</h2>
            {RoleBased?.user?.role === "super admin" ? (
                // Table format User Details for super admin
                <ShuffleSortTable uploadFile={uploadFile} data={filteredData} fileType={fileType} />
            ) : (
                <>
                    {/* dynamically send pdf links */}
                    <ModernCarousel pdf={lastItem?.fileUrl || ""} version={data?.length || 0} id={lastItem?.id || 1} />
                    <div className='w-full sm:w-1/2 mx-auto'>
                        <button type="submit" className='cursor-pointer w-full p-4 shadow-md select-none bg-secondary text-white hover:bg-primary' onClick={handleSendEmail}>Approve</button>
                    </div>
                </>)}

        </div>
    )
}
