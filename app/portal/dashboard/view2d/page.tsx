"use client";

import { GetAll2dView } from '@/components/drawings/GetAll2dView';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import { Loader } from '@/components/Loader';
import { ADD_2D_FILENAME, GET_ALL_2D_VIEW, GET_USERS } from '@/lib/Queries';
import { useMutation, useQuery } from '@apollo/client';
import { usePathname } from 'next/navigation';


interface GetAll2DViewResponse {
    getAll2DFiles: Array<{
        id: number;
        filename: string;
        fileUrl: string;
        version: number;
        userId: number
        createdAt: string;
    }>;
}

const Page = () => {
    const [uploadFile] = useMutation(ADD_2D_FILENAME);
    const { data } = useQuery<GetAll2DViewResponse>(GET_ALL_2D_VIEW)
    const { data: AllUsers, loading,refetch } = useQuery(GET_USERS);
    const pathname = usePathname();
    const fileType = pathname.split('/').pop();

    return (
        <DefaultLayout>
            {loading ? (<Loader />) : (
                <section className='h-full w-full'>
                    <GetAll2dView data={data?.getAll2DFiles} allUsers={AllUsers} uploadFile={uploadFile} fileType={fileType || 'view2d'} title={"Your 2D Drawings"} refetchUsers={refetch}/>
                </section>
            )}
        </DefaultLayout>
    );
};

export default Page;
