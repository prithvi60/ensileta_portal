"use client";
import { GetAll2dView } from '@/components/GetAll2dView';
import { InputForm } from '@/components/InputForm';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import { ADD_3D_FILENAME, ADD_BOQ_FILENAME, GET_ALL_3D_VIEW, GET_ALL_BOQ_VIEW } from '@/lib/Queries';
import { useMutation, useQuery } from '@apollo/client';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import toast from 'react-hot-toast';

interface GetAllBOQViewResponse {
    getAllBOQFiles: Array<{
        id: number;
        fileName: string;
        fileURL: string;
        version: number;
        createdAt: string;
    }>;
}

const Page = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [viewBOQFileName] = useMutation(ADD_BOQ_FILENAME, {
        refetchQueries: [{ query: GET_ALL_BOQ_VIEW }]
    })
    const { data, loading, error } = useQuery<GetAllBOQViewResponse>(GET_ALL_BOQ_VIEW)

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
    console.log(inputValue);

    return (
        <DefaultLayout>
            <section className='h-[500px] w-full space-y-10'>
                <InputForm handleChange={handleChange} handleSubmit={handleSubmit} inputValue={inputValue} />
                <GetAll2dView loading={loading} error={error} data={data?.getAllBOQFiles} />
            </section>
        </DefaultLayout>
    );
};

export default Page;
