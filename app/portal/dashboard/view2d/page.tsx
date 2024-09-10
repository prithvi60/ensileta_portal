"use client";
import { GetAll2dView } from '@/components/GetAll2dView';
import { InputForm } from '@/components/InputForm';
import DefaultLayout from '@/components/Layout/DefaultLayout';
import { ADD_2D_FILENAME, GET_ALL_2D_VIEW } from '@/lib/Queries';
import { useMutation, useQuery } from '@apollo/client';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import toast from 'react-hot-toast';

interface GetAll2DViewResponse {
    getAll2DFiles: Array<{
        id: number;
        fileName: string;
        fileURL: string;
        version: number;
        createdAt: string;
    }>;
}

const Page = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [view2dFileName] = useMutation(ADD_2D_FILENAME, {
        refetchQueries: [{ query: GET_ALL_2D_VIEW }]
    })
    const { data, loading, error } = useQuery<GetAll2DViewResponse>(GET_ALL_2D_VIEW)

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
                const result = await view2dFileName({ variables: { fileName: inputValue } })
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
    // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files && e.target.files.length > 0) {
    //         setFile(e.target.files[0]);
    //         setFileName(e.target.files[0].name)
    //     }

    // };

    // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();

    //     if (!file) {
    //         alert("No file selected");
    //         return;
    //     }

    //     console.log(file);

    //     const response = await uploadFile({
    //         variables: { file },
    //     });

    //     if (response.data) {
    //         alert(`File uploaded: ${response.data.uploadFile.filename}`);
    //     } else {
    //         alert('File upload failed');
    //     }
    // };

    return (
        <DefaultLayout>
            <section className='h-[500px] w-full space-y-10'>
                <InputForm handleChange={handleChange} handleSubmit={handleSubmit} inputValue={inputValue} />
                <GetAll2dView loading={loading} error={error} data={data?.getAll2DFiles} />
            </section>
            {/* <section className='h-[500px] w-full flex justify-center items-center'>
                <form onSubmit={handleSubmit} className='flex justify-center items-center flex-col gap-5 w-full text-center'>
                    <div className='flex justify-center items-center gap-5'>
                        <input
                            id='fileUpload'
                            type="file"
                            accept="application/pdf"
                            onChange={handleFileChange}
                            className='hidden'
                        />
                        <label htmlFor="fileUpload" className='cursor-pointer py-1.5 px-2.5 shadow-md select-none bg-primary text-white rounded-full '>Choose PDF File</label>
                        {fileName && (<p className='text-lg tracking-wide'>{fileName}</p>)}
                    </div>
                    <button type="submit" className='cursor-pointer p-3 shadow-md select-none bg-[#139F9B] text-white rounded-md '>Upload PDF</button>
                </form>
            </section> */}
        </DefaultLayout>
    );
};

export default Page;
