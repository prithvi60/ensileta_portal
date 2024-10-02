import { GET_USERS } from "@/lib/Queries";
import { useQuery } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import { SuperAdminTable } from "../drawings/Table";
import { Loader } from "../Loader";
import { CustomKanban } from "./KanbanBoard";

export const SATable = ({ name }: { name: string }) => {
    const { data: allUsers, loading, refetch } = useQuery(GET_USERS);
    const [filteredData, setFilteredData] = useState<any[]>([]);
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
                    <SuperAdminTable data={filteredData[0]} refetchUsers={refetch} />
                    <CustomKanban />
                </>
            )}
        </section>
    );
};
