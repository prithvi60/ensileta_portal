"use client";

import { useQuery } from "@apollo/client";
import { GET_EMPLOYEE_LISTS, GET_USER } from "@/lib/Queries";
import { Loader } from "../Loader";
import { CiNoWaitingSign } from "react-icons/ci";

export const EmployeeLists = () => {
    const { data: RoleBased } = useQuery(GET_USER);

    const { data, loading, error } = useQuery(GET_EMPLOYEE_LISTS, { variables: { company_name: RoleBased?.user?.company_name }, });

    if (loading) {
        return <Loader />;
    }

    if (error) {
        console.error("Error fetching data:", error);
        return <p>An error occurred while fetching data.</p>;
    }

    return (
        <div className="space-y-7 p-5">
            <h2 className="font-semibold text-3xl">Team Lists :</h2>
            {data?.getAccessControlUsers.length > 0 ? (
                <ul className="list-decimal ml-5">
                    {data?.getAccessControlUsers.map(
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
