"use client";

import { GetAll2dView } from '@/components/drawings/GetAll2dView';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import { Loader } from '@/components/Loader';
import { ADD_BOQ_FILENAME, GET_ALL_BOQ_VIEW, GET_USERS } from '@/lib/Queries';
import { useMutation, useQuery } from '@apollo/client';
import { usePathname } from 'next/navigation';


interface GetAllBOQViewResponse {
    getAllBOQFiles: Array<{
        id: number;
        filename: string;
        fileUrl: string;
        version: number;
        userId: number
        createdAt: string;
    }>;
}

const Page = () => {
    const [uploadFile] = useMutation(ADD_BOQ_FILENAME);
    const { data } = useQuery<GetAllBOQViewResponse>(GET_ALL_BOQ_VIEW)
    const { data: AllUsers, loading } = useQuery(GET_USERS);
    const pathname = usePathname();
    const fileType = pathname.split('/').pop();


    // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     if (!inputValue) {
    //         alert("please enter file name")
    //         return
    //     } else {
    //         try {
    //             const result = await viewBOQFileName({ variables: { fileName: inputValue } })
    //             if (result) {
    //                 toast.success('successfully Created', {
    //                     position: "top-right",
    //                     duration: 3000,
    //                     style: {
    //                         border: '1px solid #63b6b3',
    //                         padding: '16px',
    //                         color: '#63b6b3',
    //                     },
    //                     iconTheme: {
    //                         primary: '#63b6b3',
    //                         secondary: '#FFFAEE',
    //                     },
    //                 })
    //                 setInputValue('');
    //             }
    //         } catch (error) {
    //             console.error(error)
    //         }

    //     }
    // }
    // const length = data?.files.length

    // console.log(data?.files[length - 1] || null);

    return (
        <DefaultLayout>
            <section className='h-full w-full'>
                {loading ? (<Loader />) : (
                    <GetAll2dView data={data?.getAllBOQFiles} allUsers={AllUsers} uploadFile={uploadFile} fileType={fileType || ''} title={"Your BOQ Drawings"} />
                )}
            </section>
        </DefaultLayout>
    );
};

export default Page;
