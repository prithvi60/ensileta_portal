"use client"

import Link from 'next/link'
import React, { useState } from 'react';

interface FileData {
    id: number;
    fileName: string;
    fileURL: string;
    version: number;
    createdAt: string;
}

interface GetAll2DViewProps {
    data?: Array<FileData>
    loading?: boolean;
    error?: Error;
}

export const GetAll2dView: React.FC<GetAll2DViewProps> = ({ data, loading, error }) => {
    const [val, setVal] = useState(false)

    if (loading) {
        return (<p>Loading ....</p>)
    }

    if (error) {
        console.error('Error fetching data:', error);
        return <p>An error occurred while fetching data.</p>;
    }

    const latestFiles = data?.reduce((acc: { [key: string]: FileData }, current) => {
        const existingFile = acc[current.fileName];
        if (!existingFile || parseInt(current.createdAt) > parseInt(existingFile.createdAt)) {
            acc[current.fileName] = current;
        }
        return acc;
    }, {});

    return (
        <div className='w-full h-full p-10'>
            <div className='w-full text-end'>
                <button className='text-sm bg-green-700 p-1.5 text-white rounded-full text-end' onClick={() => setVal(!val)}>All versions</button>
            </div>
            {val ? (
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
                </>)}

            {/* )} */}

        </div>
    )
}
