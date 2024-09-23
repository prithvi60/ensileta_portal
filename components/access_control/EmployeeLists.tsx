"use client"

import { useQuery } from '@apollo/client';
import { GET_ALL_EMPLOYEE_LISTS } from '@/lib/Queries';
import { Loader } from '../Loader';

export const EmployeeLists = () => {
    const { data, loading, error } = useQuery(GET_ALL_EMPLOYEE_LISTS)

    if (loading) {
        return (<Loader />)
    }

    if (error) {
        console.error('Error fetching data:', error);
        return <p>An error occurred while fetching data.</p>;
    }
    return (
        <div className='space-y-7 p-5'>
            <h2 className='font-semibold text-3xl'>Employee Lists :</h2>
            {data ? (<ul className='list-decimal ml-5'>
                {data?.getAllAccessControlUsers.map((list: { email: string, id: number }) => (
                    <li className='text-lg tracking-wide' key={list.id}>
                        {list.email}
                    </li>
                ))}
            </ul>) : (<p>no employee lists</p>)}

        </div>
    )
}
