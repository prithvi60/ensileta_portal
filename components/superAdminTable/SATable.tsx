import { GET_USERS } from "@/lib/Queries";
import { useQuery } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import { SuperAdminTable } from "../drawings/Table";
import { Loader } from "../Loader";
import { CustomKanban } from "./KanbanBoard";
import { useSession } from "next-auth/react";

export const SATable = ({ name }: { name: string }) => {
    const { data: allUsers, loading, refetch } = useQuery(GET_USERS);
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const { data: session } = useSession();
    const role = session?.user?.role;
    const admins = useMemo(() => {
        return allUsers?.users?.filter((val: any) => val.role === "admin") || [];
    }, [allUsers]);

    useEffect(() => {
        if (name) {
            const results = admins.filter(
                (val: any) => val?.company_name === decodeURIComponent(name as string)
            );
            setFilteredData(results);
        } else {
            setFilteredData(admins);
        }
    }, [name, admins]);

    return (
        <section>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <SuperAdminTable data={filteredData[0]} refetchUsers={refetch} role={role} />
                    <CustomKanban userId={filteredData[0]?.id} role={role} />
                </>
            )}
        </section>
    );
};


{/* <div className="text-center w-full flex flex-col justify-center items-center ">
            <div
                onDrop={handleDragEnd}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`mt-10 grid size-14 shrink-0 place-content-center rounded border text-3xl ${active
                    ? "border-red-800 bg-warning/50 text-warning/80"
                    : "border-neutral-500 bg-primary text-white"
                    }`}
            >
                {active ? <FaFire className="animate-bounce text-xl" /> : <FiTrash />}
            </div>
            <div className={` ${active
                ? " text-warning/65"
                : "text-neutral-500"
                }`}>Drag and Drop to delete</div>
        </div> */}

// <div className="p-12 overflow-scroll scrollbar flex flex-col justify-center items-center">