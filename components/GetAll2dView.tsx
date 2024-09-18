"use client"

import React, { useState } from 'react';
import { SwipeCarousel } from './SwipeCarousal';
import UploadFile from './Upload';


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
}

export const GetAll2dView: React.FC<GetAll2DViewProps> = ({ data, loading, error }) => {
    // const [val, setVal] = useState(false)
    // const [pdfURL, setPdfURL] = useState("")

    if (loading) {
        return (<p>Loading ....</p>)
    }

    if (error) {
        console.error('Error fetching data:', error);
        return <p>An error occurred while fetching data.</p>;
    }
    const lastItem = data?.[data?.length - 1] || null;
    console.log(lastItem?.filename);

    // const latestFiles = data?.reduce((acc: { [key: string]: FileData }, current) => {
    //     const existingFile = acc[current.fileName];
    //     if (!existingFile || parseInt(current.createdAt) > parseInt(existingFile.createdAt)) {
    //         acc[current.fileName] = current;
    //     }
    //     return acc;
    // }, {});

    return (
        <div className='w-full h-full p-10 space-y-5'>
            <h2 className='text-3xl w-full text-center font-semibold caption-bottom tracking-wide mb-10'>Your BOQ</h2>
            {/* <div className='w-full text-end'>
                <button className='text-sm bg-green-700 p-1.5 text-white rounded-full text-end' onClick={() => setVal(!val)}>All versions</button>
            </div> */}
            {/* {val ? (
                <>
                    {data && (<ul className='list-decimal space-y-3'>
                        {data?.map(item => (
                            <li key={item.id}>
                                <Link href={`${item.fileURL}`} className='text-blue-600'>
                                    {` ${item.fileName} ${item.version}`}
                                </Link>
                            </li>
                        ))}
                    </ul>)
                    }
                </>
            ) : (
                <>
                    {latestFiles && (<ul className='list-decimal space-y-3'>
                        {Object.values(latestFiles).map(item => (
                            <li key={item.id}>
                                <Link href={`${item.fileURL}`} className='text-blue-600'>
                                    {` ${item.fileName} ${item.version}`}
                                </Link>
                            </li>
                        ))}
                    </ul>)
                    }
                </>)} */}
            {/* dynamically send pdf links */}
            <SwipeCarousel pdf={lastItem?.fileUrl || ""} fileName={lastItem?.filename || ""} />
            <div className='w-full h-full flex
             justify-center items-center gap-10'>
                <h3 className='text-xl font-medium tracking-wide capitalize'>{`file : Your_BOQ_${lastItem?.filename.replace(".pdf", "").toLowerCase()}`}</h3>
                <h3 className='text-xl font-medium tracking-wide'>{`version : ${lastItem?.version}`}</h3>
            </div>
            <UploadFile />
        </div>
    )
}
