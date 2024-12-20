"use client";

import { GetAll2dView } from "@/components/drawings/GetAll2dView";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import { Loader } from "@/components/Loader";
import { ADD_MB_FILENAME, CREATE_MARKER_GROUP_MB, GET_ALL_MB_VIEW, GET_MARKER_GROUP_BY_ID_MB, GET_USERS } from "@/lib/Queries";
import { useMutation, useQuery } from "@apollo/client";
import { usePathname } from "next/navigation";
import React from "react";

type FileData = {
    id: number;
    filename: string;
    fileUrl: string;
    version: number;
    userId: number;
    createdAt: string;
};

interface GetAllMBViewResponse {
    getAllMBFiles: FileData[];
}

type MarkerGroupResponse = {
    getMarkerGroupByMbId: {
        data: any;
    };
};

const Page: React.FC = () => {
    const pathname = usePathname();
    const fileType = pathname.split("/").pop() || "";
    const { data, loading: filesLoading } = useQuery<GetAllMBViewResponse>(GET_ALL_MB_VIEW);
    const { data: AllUsers, refetch } = useQuery(GET_USERS);

    const [uploadFile] = useMutation(ADD_MB_FILENAME);

    const lastItem =
        data?.getAllMBFiles[data?.getAllMBFiles.length - 1] ||
        data?.getAllMBFiles[0] ||
        null;

    const [createMarkerGroup] = useMutation(CREATE_MARKER_GROUP_MB, {
        refetchQueries: [
            { query: GET_MARKER_GROUP_BY_ID_MB, variables: { drawingMbId: lastItem?.id } },
        ],
        awaitRefetchQueries: true,
    });


    const { data: markerMb } = useQuery<MarkerGroupResponse>(GET_MARKER_GROUP_BY_ID_MB, {
        variables: { drawingMbId: lastItem?.id },
        skip: !lastItem?.id,
    });

    const handleCreateMarkerGroup = async (markers: any): Promise<void> => {
        if (!lastItem?.id) return;

        try {
            await createMarkerGroup({
                variables: {
                    data: markers,
                    drawingMbId: lastItem?.id,
                },
            });
        } catch (error) {
            console.error("Error creating marker group:", error);
        }
    };

    return (
        <DefaultLayout>
            <section className="h-full w-full">
                {filesLoading ? (
                    <Loader />
                ) : (
                    <GetAll2dView
                        data={data?.getAllMBFiles}
                        allUsers={AllUsers}
                        uploadFile={uploadFile}
                        fileType={fileType || ""}
                        approveType={"DRAWING_MB"}
                        title={"Your Mood Board Drawings"}
                        refetchUsers={refetch}
                        lastItem={lastItem}
                        createMarkerGroup={handleCreateMarkerGroup}
                        markerData={markerMb?.getMarkerGroupByMbId?.data}
                    />
                )}
            </section>
        </DefaultLayout>
    );
};

export default Page;
