"use client";

import { useQuery } from "@apollo/client";
import { GET_ALL_EMPLOYEE_LISTS } from "@/lib/Queries";
import { Loader } from "../Loader";
import { CiNoWaitingSign } from "react-icons/ci";

export const EmployeeLists = () => {
    const { data, loading, error } = useQuery(GET_ALL_EMPLOYEE_LISTS);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        console.error("Error fetching data:", error);
        return <p>An error occurred while fetching data.</p>;
    }
    console.log(data?.getAllAccessControlUsers.length);

    return (
        <div className="space-y-7 p-5">
            <h2 className="font-semibold text-3xl">Team Lists :</h2>
            {data?.getAllAccessControlUsers.length > 0 ? (
                <ul className="list-decimal ml-5">
                    {data?.getAllAccessControlUsers.map(
                        (list: { email: string; id: number }) => (
                            <li className="text-lg tracking-wide" key={list.id}>
                                {list.email}
                            </li>
                        )
                    )}
                </ul>
            ) : (
                <p className="text-lg flex items-center gap-3 text-black capitalize">
                    <span>
                        <CiNoWaitingSign className="text-xl text-slate-500" />
                    </span>
                    It looks like we don&apos;t have any team members listed at the
                    moment!
                </p>
            )}
        </div>
    );
};
