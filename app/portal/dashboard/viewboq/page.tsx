"use client";
import { GetAll2dView } from '@/components/GetAll2dView';
import { InputForm } from '@/components/InputForm';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import { ADD_3D_FILENAME, ADD_BOQ_FILENAME, GET_ALL_3D_VIEW, GET_ALL_BOQ_VIEW, GET_USER, GET_YOUR_BOQ } from '@/lib/Queries';
import { useMutation, useQuery } from '@apollo/client';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import toast from 'react-hot-toast';

interface GetAllBOQViewResponse {
    files: Array<{
        id: number;
        filename: string;
        fileUrl: string;
        version: number;
        userId: number
        createdAt: string;
    }>;
}

const Page = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [viewBOQFileName] = useMutation(ADD_BOQ_FILENAME, {
        refetchQueries: [{ query: GET_YOUR_BOQ }],
        awaitRefetchQueries: true,
    })
    const { data, loading, error } = useQuery<GetAllBOQViewResponse>(GET_YOUR_BOQ)
    const { data: RoleBased, } = useQuery(GET_USER);
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.value) {
            setInputValue(e.target.value || '')
        }
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputValue) {
            alert("please enter file name")
            return
        } else {
            try {
                const result = await viewBOQFileName({ variables: { fileName: inputValue } })
                if (result) {
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
                    setInputValue('');
                }
            } catch (error) {
                console.error(error)
            }

        }
    }

    const length = data?.files.length

    // console.log(data?.files[length - 1] || null);


    return (
        <DefaultLayout>
            <section className='h-full w-full'>
                <GetAll2dView loading={loading} error={error} data={data?.files} />
                {/* {RoleBased?.user?.role === "super admin" ? (
                    <InputForm handleChange={handleChange} handleSubmit={handleSubmit} inputValue={inputValue} />
                ) : (
                    <div className='w-full h-auto flex justify-center items-center'>
                        <button type="submit" className='cursor-pointer p-1.5 shadow-md select-none bg-[#139F9B] text-white rounded-md'>Approval</button>
                    </div>
                )} */}
            </section>
        </DefaultLayout>
    );
};

export default Page;
