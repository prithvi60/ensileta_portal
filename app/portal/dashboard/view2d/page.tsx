"use client";

import { GetAll2dView } from '@/components/drawings/GetAll2dView';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import { ADD_2D_FILENAME, GET_ALL_2D_VIEW } from '@/lib/Queries';
import { useMutation, useQuery } from '@apollo/client';


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
    const { data, loading, error } = useQuery<GetAll2DViewResponse>(GET_ALL_2D_VIEW)


    return (
        <DefaultLayout>
            <section className='h-full w-full'>
                <GetAll2dView loading={loading} error={error} data={data?.getAll2DFiles} uploadFile={uploadFile} title={"Your 2D Drawings"} />
            </section>
        </DefaultLayout>
    );
};

export default Page;
