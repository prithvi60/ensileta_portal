"use client"
import { GET_USERS } from "@/lib/Queries";
import { useQuery } from "@apollo/client";
import React, { useEffect, useMemo, useState } from "react";
import { SuperAdminTable } from "../drawings/Table";
import { Loader } from "../Loader";
import { CustomKanban } from "./KanbanBoard";
import { useSession } from "next-auth/react";

export const SATable = ({ name }: { name: string }) => {
    const { data: allUsers, loading, refetch } = useQuery(GET_USERS, {
        fetchPolicy: 'network-only',
        nextFetchPolicy: 'cache-first',
        pollInterval: 30000, // Poll every 30 seconds
    });
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const { data: session, status } = useSession();
    const role = session?.user?.role;

    const sessionSignature = useMemo(() => {
        return session ? `${session.user?.email}-${session.user?.role}-${Date.now()}` : '';
    }, [session]);

    const admins = useMemo(() => {
        return allUsers?.users?.filter((val: any) => val.role === "admin") || [];
    }, [allUsers]);

    useEffect(() => {
        // Force refresh when session changes
        if (status === 'authenticated') {
            refetch();
        }
    }, [status, refetch]);

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
                    <SuperAdminTable key={sessionSignature} data={filteredData[0]} refetchUsers={refetch} role={role} />
                    <CustomKanban userId={filteredData[0]?.id} role={role} />
                </>
            )}
        </section>
    );
};
