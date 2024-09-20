"use client"

import ModernCarousel from './SwipeCarousal';
import UploadFile from './Upload';
import ShuffleSortTable from './Table';
import { GET_USER } from '@/lib/Queries';
import { useQuery } from '@apollo/client';


interface FileData {
    id: number;
    filename: string;
    fileUrl: string;
    version: number;
    createdAt: string;
}

interface GetAll2DViewProps {
    data?: Array<FileData>
    loading?: boolean;
    error?: Error;
    uploadFile: any
    title: string
}

export const GetAll2dView: React.FC<GetAll2DViewProps> = ({ data, loading, error, uploadFile, title }) => {

    const { data: RoleBased } = useQuery(GET_USER);

    if (loading) {
        return (<div className='text-warning text-xl w-full h-screen flex justify-center items-center'>Loading ....</div>)
    }

    if (error) {
        console.error('Error fetching data:', error);
        return <p>An error occurred while fetching data.</p>;
    }
    const lastItem = data?.[data?.length - 1] || null;
    // console.log(lastItem?.id);

    return (
        <div className='w-full h-screen p-10 space-y-5'>
            <h2 className='text-3xl w-full text-center font-semibold caption-bottom tracking-wide mb-10'>{title}</h2>
            {RoleBased?.user?.role === "super admin" ? (
                // Table format User Details for super admin
                <ShuffleSortTable uploadFile={uploadFile} version={data?.length || 0} pdf={lastItem?.fileUrl || ""} id={lastItem?.id || 1} />
            ) : (
                <>
                    {/* dynamically send pdf links */}
                    {/* <SwipeCarousel pdf={lastItem?.fileUrl || ""} version={data?.length || 0} /> */}
                    <ModernCarousel pdf={lastItem?.fileUrl || ""} version={data?.length || 0} id={lastItem?.id || 1} />
                    {/* <UploadFile uploadFile={uploadFile} /> */}
                    <div className='w-full sm:w-1/2 mx-auto'>
                        <button type="submit" className='cursor-pointer w-full p-4 shadow-md select-none bg-secondary text-white hover:bg-primary'>Approve</button>
                    </div>
                </>)}

        </div>
    )
}
